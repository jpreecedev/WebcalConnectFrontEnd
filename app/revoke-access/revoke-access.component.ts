import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../Jwt";

@Component({
    templateUrl: "app/revoke-access/revoke-access.component.html",
    styleUrls: ["app/revoke-access/styles.css"],
})
@CanActivate(() => hasValidToken(["Administrator"]))
export class RevokeAccessComponent {

}
