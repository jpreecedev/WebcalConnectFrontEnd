import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {HttpService} from "../utilities/HttpService";
import {ManageAccessService} from "./manage-access.service";
import {hasValidToken} from "../utilities/Jwt";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {AnimatedButtonComponent} from "../utilities/animated-button/animated-button.component";

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
    directives: [SpinnerComponent, AnimatedButtonComponent]
})
@CanActivate(() => hasValidToken(["Administrator"]))
export class ManageAccessComponent implements OnInit {

    private _isRequesting: boolean;
    private _isUpdating: boolean;
    private _users: ManageAccessUser[];
    private _connectedSites: ManageAccessSite[];

    constructor(private _service: ManageAccessService) {

    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getUsers().subscribe((data: ManageAccessUser[]) => {
            data.unshift(<ManageAccessUser>{ id: -1, name: "" });
            this._users = data;
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
            this._isRequesting = false;
        });
    }

    toggleAccess(site: ManageAccessSite): void {
        this._isUpdating = true;
        this._service.toggleSite(site).subscribe(() => {
            site.isRevoked = !site.isRevoked;
            this._isUpdating = false;
        });
    }

}
