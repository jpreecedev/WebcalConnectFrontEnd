import { Component } from "angular2/core";
import { CanActivate, Router } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    templateUrl: "app/register-user/register-user.component.html",
    styleUrls: ["app/register-user/styles.css"],
})
@CanActivate(() => hasValidToken())
export class RegisterUserComponent {

    constructor(private _router: Router) {

    }

    cancel() {
        this._router.parent.navigate(["Dashboard"]);
    }

}
