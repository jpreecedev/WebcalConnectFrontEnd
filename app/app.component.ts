import {Component, enableProdMode} from "angular2/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CalibrationsDueComponent} from "./calibrations-due/calibrations-due.component";
import {GenerateEmailComponent} from "./generate-email/generate-email.component";
import {InspectionDataComponent} from "./inspection-data/inspection-data.component";
import {RecentCalibrationsComponent} from "./recent-calibrations/recent-calibrations.component";
import {QCCheckComponent} from "./qc-check/qc-check.component";
import {CentreCheckComponent} from "./centre-check/centre-check.component";
import {RegisterUserComponent} from "./register-user/register-user.component";
import {ManageAccessComponent} from "./manage-access/manage-access.component";
import {SoftwareLicensesComponent} from "./software-licenses/software-licenses.component";
import {StatusReportComponent} from "./status-report/status-report.component";

import {AuthRouterOutlet} from "./utilities/auth-router/auth-router.component";
import {JwtHelper} from "./utilities/JwtHelper";

enableProdMode();

export interface MenuItem {
    icon: string;
    routerLink: string;
    text: string;
}

export interface Route {
    path: string;
    name: string;
    component: any;
    role: string,
    useAsDefault?: boolean;
}

export var Routes: Route[] = [
    { path: "/", name: "Home", component: HomeComponent, role: "", useAsDefault: true },
    { path: "/login", name: "Login", role: "", component: LoginComponent },
    { path: "/dashboard", name: "Dashboard", role: "TachographCentre", component: DashboardComponent },
    { path: "/calibrations-due", name: "CalibrationsDue", role: "TachographCentre", component: CalibrationsDueComponent },
    { path: "/generate-email", name: "GenerateEmail", role: "TachographCentre", component: GenerateEmailComponent },
    { path: "/status-report", name: "StatusReport", role: "TachographCentre", component: StatusReportComponent },
    { path: "/inspection-data", name: "InspectionData", role: "TachographCentre", component: InspectionDataComponent },
    { path: "/recent-calibrations", name: "RecentCalibrations", role: "TachographCentre", component: RecentCalibrationsComponent },
    { path: "/qc-check", name: "QCCheck", role: "TachographCentre", component: QCCheckComponent },
    { path: "/centre-check", name: "CentreCheck", role: "TachographCentre", component: CentreCheckComponent },
    { path: "/register-user", name: "RegisterUser", role: "Administrator", component: RegisterUserComponent },
    { path: "/manage-access", name: "ManageAccess", role: "Administrator", component: ManageAccessComponent },
    { path: "/software-licenses", name: "SoftwareLicenses", role: "Administrator", component: SoftwareLicensesComponent }
];

@Component({
    selector: "wc-app",
    templateUrl: "app/app.component.html",
    styleUrls: ["app/styles.css"],
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet],
    providers: [JwtHelper],
})
@RouteConfig(Routes)
export class AppComponent {

    public isLoggedIn: boolean = true;
    
    constructor(private router: Router, private jwtHelper: JwtHelper) {
                
    }

    logout(): void {
        this.jwtHelper.logout();
        this.router.navigate(["Home"]);
    }
}
