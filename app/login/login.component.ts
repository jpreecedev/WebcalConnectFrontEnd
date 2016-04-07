import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {HttpService} from "../utilities/HttpService";
import {hasValidToken} from "../utilities/Jwt";
import {JwtHelper} from "../utilities/JwtHelper";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";

@Component({
    selector: "login",
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [HttpService, JwtHelper],
    directives: [WCButtonComponent]
})
export class LoginComponent implements OnInit {

    private _isRequesting: boolean = false;

    constructor(private _httpService: HttpService, private _router: Router, private _jwtHelper: JwtHelper) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this._isRequesting = true;
        this._httpService.authenticate(username, password, rememberMe)
            .subscribe((response: boolean) => {
                if (response) {
                    this._router.navigate(["Dashboard"]);
                }
                this._isRequesting = false;
            });

    }

    ngOnInit(): void {
        if (hasValidToken()) {
            this._router.navigate(["Dashboard"]);
        }
    }

}
