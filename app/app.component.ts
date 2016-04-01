import {Component, OnChanges, SimpleChange, Input} from "angular2/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angular2/router";
import {JwtHelper} from "./utilities/JwtHelper";
import {Observable} from "rxjs/Observable";

import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CalibrationsDueComponent} from "./calibrations-due/calibrations-due.component";
import {GenerateEmailComponent} from "./generate-email/generate-email.component";
import {InspectionDataComponent} from "./inspection-data/inspection-data.component";
import {RecentCalibrationsComponent} from "./recent-calibrations/recent-calibrations.component";
import {RegisterUserComponent} from "./register-user/register-user.component";
import {RevokeAccessComponent} from "./revoke-access/revoke-access.component";
import {SearchMyDepotComponent} from "./search-my-depot/search-my-depot.component";
import {SoftwareLicensesComponent} from "./software-licenses/software-licenses.component";
import {AuthRouterOutlet} from "./utilities/auth-router/auth-router.component";

export interface MenuItem {
    icon: string;
    routerLink: string;
    text: string;
}

@Component({
    selector: "main-app",
    templateUrl: "app/app.component.html",
    styleUrls: ["app/styles.css"],
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet],
    providers: [ROUTER_PROVIDERS, JwtHelper],
})
@RouteConfig([
    { path: "/", name: "Home", component: HomeComponent, useAsDefault: true },
    { path: "/login", name: "Login", component: LoginComponent },
    { path: "/dashboard", name: "Dashboard", component: DashboardComponent },
    { path: "/calibrations-due", name: "CalibrationsDue", component: CalibrationsDueComponent },
    { path: "/generate-email", name: "GenerateEmail", component: GenerateEmailComponent },
    { path: "/inspection-data", name: "InspectionData", component: InspectionDataComponent },
    { path: "/recent-calibrations", name: "RecentCalibrations", component: RecentCalibrationsComponent },
    { path: "/register-user", name: "RegisterUser", component: RegisterUserComponent },
    { path: "/revoke-access", name: "RevokeAccess", component: RevokeAccessComponent },
    { path: "/search-my-depot", name: "SearchMyDepot", component: SearchMyDepotComponent },
    { path: "/software-licenses", name: "SoftwareLicenses", component: SoftwareLicensesComponent },
])
export class AppComponent {
    
    public isLoggedIn: boolean;
    
    constructor(private _router: Router, private _jwtHelper: JwtHelper) {
        
    }
        
    logout(){
        this._jwtHelper.logout();
        this._router.navigate(["Home"]);
    }
}
