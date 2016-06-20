import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router-deprecated";
import { HttpService } from "../utilities/HttpService";
import { JwtHelper } from "../utilities/JwtHelper";
import { WCButtonComponent } from "../utilities/wc-button/wc-button.component";
import { ShowError } from "../utilities/messageBox";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    selector: "login",
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [HttpService, JwtHelper],
    directives: [WCButtonComponent]
})
export class LoginComponent implements OnInit {

    private isRequesting: boolean = false;
    private isLoggedIn: boolean = false;

    constructor(private httpService: HttpService, private router: Router, private jwtHelper: JwtHelper) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this.isRequesting = true;
        this.httpService.authenticate(username, password, rememberMe).subscribe((response: boolean) => {
            if (response) {
                this.loggedInChanged(true);
                this.router.navigate(["Dashboard"]);
            }
        },
            (error: any) => {
                ShowError("Unable to log in at this time, please try again later.", error);
                this.isRequesting = false;
            },
            () => {
                this.isRequesting = false;
            });
    }

    loggedInChanged(value: boolean) {
        this.isLoggedIn = value;
    }

    ngOnInit(): void {
        if (hasValidToken()) {
            this.loggedInChanged(true);
            this.router.navigate(["Dashboard"]);
        }
        else {
            this.loggedInChanged(false);
        }
    }

}
