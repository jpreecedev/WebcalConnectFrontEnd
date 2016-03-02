import { Component } from "angular2/core";
import { Router } from "angular2/router";
import { LoginService } from "./login.service";

@Component({
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [LoginService]
})
export class LoginComponent {

    constructor(private _loginService: LoginService, private _router: Router) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this._loginService.authenticate(username, password, rememberMe)
            .then((response: boolean) => {
                if (response) {
                    this._router.parent.navigate(["Dashboard"]);
                }
            });

    }

}
