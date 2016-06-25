import { Component, OnInit } from "@angular/core";
import { Router, ROUTER_DIRECTIVES } from "@angular/router-deprecated";
import { isAdministrator, isDirectUploadUser } from "../utilities/Jwt";
import { MenuItem } from "../app.component";
import { Angulartics2On } from "angulartics2/src/core/angulartics2On";

@Component({
    templateUrl: "app/dashboard/dashboard.component.html",
    styleUrls: ["app/dashboard/styles.css"],
    directives: [ROUTER_DIRECTIVES, Angulartics2On],
})
export class DashboardComponent implements OnInit {

    dashboardItems: Array<MenuItem>;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.dashboardItems = [
            <MenuItem>{ icon: "fa-history", routerLink: "RecentCalibrations", text: "Recent Calibrations" },
            <MenuItem>{ icon: "fa-clipboard", routerLink: "QCCheck", text: "QC Check" },
            <MenuItem>{ icon: "fa-clock-o", routerLink: "CentreCheck", text: "Centre Check" },
            <MenuItem>{ icon: "fa-bar-chart", routerLink: "StatusReport", text: "Status Report" },
            <MenuItem>{ icon: "fa-list-alt", routerLink: "CalibrationsDue", text: "Calibrations Due" },
            <MenuItem>{ icon: "fa-envelope", routerLink: "GenerateEmail", text: "Generate Email" },
            <MenuItem>{ icon: "fa-search", routerLink: "InspectionData", text: "Inspection Data" }
        ];

        if (isAdministrator()) {
            this.dashboardItems.push(...[
                <MenuItem>{ icon: "fa-users", routerLink: "ManageAccess", text: "Manage Access" },
                <MenuItem>{ icon: "fa-certificate", routerLink: "SoftwareLicenses", text: "Software Licenses" },
                <MenuItem>{ icon: "fa-at", routerLink: "RegisterUser", text: "Register User" },
                <MenuItem>{ icon: "fa-bug", routerLink: "DetailedExceptions", text: "Exception Log" }
            ]);
        }

        if (isDirectUploadUser()) {
            this.dashboardItems.push(...[
                <MenuItem>{ icon: "fa-cloud-upload", routerLink: "DirectUpload", text: "Certificate Upload" }
            ]);
        }
    }

    navigate(dashboardItem: MenuItem): void {
        this.router.navigate([dashboardItem.routerLink]);
    }

}
