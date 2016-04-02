import { Component, OnInit } from "angular2/core";
import { Router } from "angular2/router";
import { HttpService } from "../utilities/HttpService";
import { hasValidToken } from "../utilities/Jwt";
import { JwtHelper } from "../utilities/JwtHelper";

@Component({
    selector: "login",
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [HttpService, JwtHelper]
})
export class LoginComponent implements OnInit {

    constructor(private _httpService: HttpService, private _router: Router, private _jwtHelper: JwtHelper) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this._httpService.authenticate(username, password, rememberMe)
            .subscribe((response: boolean) => {
                if (response) {
                    this._router.navigate(["Dashboard"]);
                }
            });

    }

    ngOnInit(): void {
        if (hasValidToken()) {
            this._router.navigate(["Dashboard"]);
        }
    }

}
