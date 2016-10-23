import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isAdministrator, isDirectUploadUser } from '../utilities/Jwt';
import { MenuItem } from '../app.component';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent implements OnInit {

    dashboardItems: Array<MenuItem>;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.dashboardItems = [
            <MenuItem>{ icon: 'fa-history', routerLink: 'recent-calibrations', text: 'Recent Calibrations' },
            <MenuItem>{ icon: 'fa-clipboard', routerLink: 'qc-check', text: 'QC Check' },
            <MenuItem>{ icon: 'fa-clock-o', routerLink: 'centre-check', text: 'Centre Check' },
            <MenuItem>{ icon: 'fa-bar-chart', routerLink: 'status-report', text: 'Status Report' },
            <MenuItem>{ icon: 'fa-list-alt', routerLink: 'calibrations-due', text: 'Calibrations Due' },
            <MenuItem>{ icon: 'fa-envelope', routerLink: 'generate-email', text: 'Generate Email' },
            <MenuItem>{ icon: 'fa-search', routerLink: 'inspection-data', text: 'Inspection Data' },
            <MenuItem>{ icon: 'fa-book', routerLink: 'address-book', text: 'Address Book' }
        ];

        if (isAdministrator()) {
            this.dashboardItems.push(...[
                <MenuItem>{ icon: 'fa-users', routerLink: 'manage-access', text: 'Manage Access' },
                <MenuItem>{ icon: 'fa-certificate', routerLink: 'software-licenses', text: 'Software Licenses' },
                <MenuItem>{ icon: 'fa-at', routerLink: 'register-user', text: 'Register User' },
                <MenuItem>{ icon: 'fa-bug', routerLink: 'detailed-exceptions', text: 'Exception Log' }
            ]);
        }

        if (isDirectUploadUser()) {
            this.dashboardItems.push(...[
                <MenuItem>{ icon: 'fa-cloud-upload', routerLink: 'direct-upload', text: 'Certificate Upload' }
            ]);
        }
    }

    navigate(dashboardItem: MenuItem): void {
        this.router.navigate([dashboardItem.routerLink]);
    }

}
