import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../Jwt";

@Component({
    templateUrl: "app/calibrations-due/calibrations-due.component.html",
    styleUrls: ["app/calibrations-due/styles.css"],
})
@CanActivate(() => hasValidToken())
export class CalibrationsDueComponent {

}
