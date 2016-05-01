import { Component, OnInit } from "angular2/core";
import { Router, ROUTER_DIRECTIVES } from "angular2/router";
import { isAdministrator } from "../utilities/Jwt";
import { MenuItem } from "../app.component";

@Component({
    templateUrl: "app/dashboard/dashboard.component.html",
    styleUrls: ["app/dashboard/styles.css"],
    directives: [ROUTER_DIRECTIVES],
})
export class DashboardComponent implements OnInit {

    dashboardItems: Array<MenuItem>;

    constructor(private _router: Router) {
    }

    ngOnInit(): void {
        this.dashboardItems = [
            <MenuItem>{ icon: "fa-history", routerLink: "RecentCalibrations", text: "Recent Calibrations" },
            <MenuItem>{ icon: "fa-clipboard", routerLink: "QCCheck", text: "QC Check" },
            <MenuItem>{ icon: "fa-clock-o", routerLink: "CentreCheck", text: "Centre Check" },
            <MenuItem>{ icon: "fa-list-alt", routerLink: "CalibrationsDue", text: "Calibrations Due" },
            <MenuItem>{ icon: "fa-envelope", routerLink: "GenerateEmail", text: "Generate Email" },
            <MenuItem>{ icon: "fa-search", routerLink: "InspectionData", text: "Inspection Data" }
        ];

        if (isAdministrator()) {
            this.dashboardItems.push(...[
                <MenuItem>{ icon: "fa-users", routerLink: "ManageAccess", text: "Manage Access" },
                <MenuItem>{ icon: "fa-certificate", routerLink: "SoftwareLicenses", text: "Software Licenses" },
                <MenuItem>{ icon: "fa-at", routerLink: "RegisterUser", text: "Register User" }
            ]);
        }
    }

    navigate(dashboardItem: MenuItem): void {
        this._router.navigate([dashboardItem.routerLink]);
    }

}
