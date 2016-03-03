import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    templateUrl: "app/generate-email/generate-email.component.html",
    styleUrls: ["app/generate-email/styles.css"],
})
@CanActivate(() => hasValidToken())
export class GenerateEmailComponent {

}
