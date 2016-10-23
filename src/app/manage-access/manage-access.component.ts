import { Component, OnInit } from '@angular/core';
import { HttpService } from '../utilities/http.service';
import { ManageAccessService } from './manage-access.service';
import { ShowError } from '../utilities/messageBox';
import { IPaginationInstance } from 'ng2-pagination';

export interface ManageAccessUser {
    id: number;
    name: string;
}

export interface ManageAccessSite {
    description: string;
    isRevoked: boolean;
}

@Component({
    templateUrl: './manage-access.component.html',
    styleUrls: ['./styles.scss'],
    providers: [HttpService, ManageAccessService]
})
export class ManageAccessComponent implements OnInit {

    public paginationConfig: IPaginationInstance = {
        id: 'manageAccess',
        itemsPerPage: 10,
        currentPage: 1
    };

    private isRequesting: boolean;
    private isUpdating: boolean;
    private users: ManageAccessUser[];
    private connectedSites: ManageAccessSite[];
    private selectedSiteId: number;

    constructor(private service: ManageAccessService) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getUsers().subscribe((data: ManageAccessUser[]) => {
            this.users = data;
            this.selectedSiteId = this.users[0].id;
            this.getConnectedSites(this.selectedSiteId);
        },
        (error: any) => {
            ShowError('Unable to get a list of users, please try again later.', error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    getConnectedSites(siteId: number): void {
        if (siteId < 1) {
            this.connectedSites = undefined;
            return;
        }

        this.isRequesting = true;
        this.service.getConnectedSites(siteId).subscribe((data: ManageAccessSite[]) => {
            this.connectedSites = data;
        },
        (error: any) => {
            ShowError('Unable to get a list of connected sites, please try again later.', error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    toggleAccess(site: ManageAccessSite): void {
        this.isUpdating = true;
        this.service.toggleSite(site).subscribe(() => {
            site.isRevoked = !site.isRevoked;
        },
        (error: any) => {
            ShowError('Unable to change the access permission for this site, please try again later.', error);
            this.isUpdating = false;
        },
        () => {
            this.isUpdating = false;
        });
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
