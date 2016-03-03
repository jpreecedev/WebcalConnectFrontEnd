import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    templateUrl: "app/inspection-data/inspection-data.component.html",
    styleUrls: ["app/inspection-data/styles.css"],
})
@CanActivate(() => hasValidToken())
export class InspectionDataComponent {

}
