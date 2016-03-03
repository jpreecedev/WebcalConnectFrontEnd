import { Component } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../Jwt";

@Component({
    templateUrl: "app/register-user/register-user.component.html",
    styleUrls: ["app/register-user/styles.css"],
})
@CanActivate(() => hasValidToken())
export class RegisterUserComponent {

}
