import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {HttpService} from "../utilities/HttpService";
import {JwtHelper} from "../utilities/JwtHelper";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {ShowError} from "../utilities/messageBox";
import {hasValidToken} from "../utilities/Jwt";

@Component({
    selector: "login",
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [HttpService, JwtHelper],
    directives: [WCButtonComponent]
})
export class LoginComponent implements OnInit {

    private _isRequesting: boolean = false;
    private _isLoggedIn: boolean = false;

    constructor(private _httpService: HttpService, private _router: Router, private _jwtHelper: JwtHelper) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this._isRequesting = true;
        this._httpService.authenticate(username, password, rememberMe).subscribe((response: boolean) => {
            if (response) {
                this.loggedInChanged(true);
                this._router.navigate(["Dashboard"]);
            }
        },
        (error: any) => {
            ShowError("Unable to log in at this time, please try again later.", error);
            this._isRequesting = false;
        },
        () => {
            this._isRequesting = false;
        });
    }

    loggedInChanged(value: boolean) {
        this._isLoggedIn = value;
    }

    ngOnInit(): void {
        if (hasValidToken()) {
            this.loggedInChanged(true);
            this._router.navigate(["Dashboard"]);
        }
        else {
            this.loggedInChanged(false);
        }
    }

}
