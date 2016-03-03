import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../Jwt";

@Component({
    templateUrl: "app/recent-calibrations/recent-calibrations.component.html",
    styleUrls: ["app/recent-calibrations/styles.css"],
})
@CanActivate(() => hasValidToken())
export class RecentCalibrationsComponent {

}
