import {Component, OnInit} from "angular2/core";
import {HttpService} from "../utilities/HttpService";
import {ManageAccessService} from "./manage-access.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {ShowError} from "../utilities/messageBox";

export interface ManageAccessUser {
    id: number;
    name: string;
}

export interface ManageAccessSite {
    description: string;
    isRevoked: boolean;
}

@Component({
    templateUrl: "app/manage-access/manage-access.component.html",
    styleUrls: ["app/manage-access/styles.css"],
    providers: [HttpService, ManageAccessService],
    directives: [SpinnerComponent, WCButtonComponent]
})
export class ManageAccessComponent implements OnInit {

    private _isRequesting: boolean;
    private _isUpdating: boolean;
    private _users: ManageAccessUser[];
    private _connectedSites: ManageAccessSite[];
    private _selectedSiteId: number;

    constructor(private _service: ManageAccessService) {
    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getUsers().subscribe((data: ManageAccessUser[]) => {
            this._users = data;
            this._selectedSiteId = this._users[0].id;
            this.getConnectedSites(this._selectedSiteId);
        },
        (error: any) => {
            ShowError("Unable to get a list of users, please try again later.", error);
            this._isRequesting = false;
        },
        () => {
            this._isRequesting = false;
        });
    }

    getConnectedSites(siteId: number): void {
        if (siteId < 1) {
            this._connectedSites = undefined;
            return;
        }

        this._isRequesting = true;
        this._service.getConnectedSites(siteId).subscribe((data: ManageAccessSite[]) => {
            this._connectedSites = data;
        },
        (error: any) => {
            ShowError("Unable to get a list of connected sites, please try again later.", error);
            this._isRequesting = false;            
        }, 
        () => {
            this._isRequesting = false;            
        });
    }

    toggleAccess(site: ManageAccessSite): void {
        this._isUpdating = true;
        this._service.toggleSite(site).subscribe(() => {
            site.isRevoked = !site.isRevoked;
        },
        (error: any) =>{
            ShowError("Unable to change the access permission for this site, please try again later.", error);
            this._isUpdating = false;            
        },
        () => {
            this._isUpdating = false;            
        });
    }

}
