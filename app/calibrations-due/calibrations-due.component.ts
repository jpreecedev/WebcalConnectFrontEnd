import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";

@Component({
    templateUrl: "app/calibrations-due/calibrations-due.component.html",
    styleUrls: ["app/calibrations-due/styles.css"],
})
@CanActivate(() => {return true;})
export class CalibrationsDueComponent {

}
  