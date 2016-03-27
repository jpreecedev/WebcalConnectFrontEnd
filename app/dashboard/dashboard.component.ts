import { Component, OnInit } from "angular2/core";
import { CanActivate, Router, ROUTER_DIRECTIVES } from "angular2/router";
import { hasValidToken, isAdministrator } from "../utilities/Jwt";
import { MenuItem } from "../app.component";

@Component({
    templateUrl: "app/dashboard/dashboard.component.html",
    styleUrls: ["app/dashboard/styles.css"],
    directives: [ROUTER_DIRECTIVES],
})
@CanActivate(() => hasValidToken())
export class DashboardComponent implements OnInit {

    private _dashboardItems: Array<MenuItem>;

    constructor(private _router: Router) {

    }

    ngOnInit() {
        this._dashboardItems = [
            <MenuItem>{ icon: "fa-history", routerLink: "RecentCalibrations", text: "Recent Calibrations" },
            <MenuItem>{ icon: "fa-truck", routerLink: "SearchMyDepot", text: "Search My Depot" },
            <MenuItem>{ icon: "fa-list-alt", routerLink: "CalibrationsDue", text: "Calibrations Due" },
            <MenuItem>{ icon: "fa-envelope", routerLink: "GenerateEmail", text: "Generate Email" },
            <MenuItem>{ icon: "fa-search", routerLink: "InspectionData", text: "Inspection Data" },

        ];

        if (isAdministrator()) {
            this._dashboardItems.push(...[
                <MenuItem>{ icon: "fa-users", routerLink: "RevokeAccess", text: "Revoke Access" },
                <MenuItem>{ icon: "fa-certificate", routerLink: "SoftwareLicenses", text: "Software Licenses" },
                <MenuItem>{ icon: "fa-at", routerLink: "RegisterUser", text: "Register User" }
            ]);
        }
    }

    private navigate(dashboardItem: MenuItem) {
        this._router.parent.navigate([dashboardItem.routerLink]);
    }

}
