import { Component } from "angular2/core";
import { CanActivate, ROUTER_DIRECTIVES } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    templateUrl: "app/dashboard/dashboard.component.html",
    styleUrls: ["app/dashboard/styles.css"],
    directives: [ROUTER_DIRECTIVES],
})
@CanActivate(() => hasValidToken())
export class DashboardComponent {

}
