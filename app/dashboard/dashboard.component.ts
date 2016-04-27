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

    private _dashboardItems: Array<MenuItem>;

    constructor(private _router: Router) {
    }

    ngOnInit(): void {
        this._dashboardItems = [
            <MenuItem>{ icon: "fa-history", routerLink: "RecentCalibrations", text: "Recent Calibrations" },
            <MenuItem>{ icon: "fa-clipboard", routerLink: "QCCheck", text: "QC Check" },
            <MenuItem>{ icon: "fa-clock-o", routerLink: "CentreCheck", text: "Centre Check" },
            <MenuItem>{ icon: "fa-list-alt", routerLink: "CalibrationsDue", text: "Calibrations Due" },
            <MenuItem>{ icon: "fa-envelope", routerLink: "GenerateEmail", text: "Generate Email" },
            <MenuItem>{ icon: "fa-search", routerLink: "InspectionData", text: "Inspection Data" }
        ];

        if (isAdministrator()) {
            this._dashboardItems.push(...[
                <MenuItem>{ icon: "fa-users", routerLink: "ManageAccess", text: "Manage Access" },
                <MenuItem>{ icon: "fa-certificate", routerLink: "SoftwareLicenses", text: "Software Licenses" },
                <MenuItem>{ icon: "fa-at", routerLink: "RegisterUser", text: "Register User" }
            ]);
        }
        
        this._dashboardItems.push(...[
            <MenuItem>{ icon: "fa-briefcase", routerLink: "DeskBasedAssessment", text: "Desk Based Assessment" },
            <MenuItem>{ icon: "fa-download", routerLink: "DownloadedData", text: "Downloaded Data" },
            <MenuItem>{ icon: "fa-cog", routerLink: "EquipmentCertificates", text: "Equipment Certificates" }
        ]);
    }

    navigate(dashboardItem: MenuItem): void {
        this._router.navigate([dashboardItem.routerLink]);
    }

}
