import {Component} from "angular2/core";
import {CanActivate, Router} from "angular2/router";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {Response} from "angular2/http";
import {RegisterUserService} from "./register-user.service";
import {AnimatedButtonComponent} from "../utilities/animated-button/animated-button.component";

export interface UserRegistration {
    emailAddress: string;
    companyName: string;
    expiration: string;
    licenseKey: string;
}

@Component({
    templateUrl: "app/register-user/register-user.component.html",
    styleUrls: ["app/register-user/styles.css"],
    providers: [RegisterUserService, HttpService],
    directives: [AnimatedButtonComponent]
})
@CanActivate(() => hasValidToken(["Administrator"]))
export class RegisterUserComponent {

    private _userRegistration: UserRegistration;
    private _isRequesting: boolean = false;

    constructor(private _router: Router, private _service: RegisterUserService) {
        this._userRegistration = {
            emailAddress: "",
            companyName: "",
            expiration: "",
            licenseKey: ""
        };
    }

    getLicenseKey(expiration: string): void {
        this._service.getLicenseKey(expiration).subscribe((response: Response) => {
            this._userRegistration.licenseKey = response.json().key;
        });
    }

    submit(): void {
        this._isRequesting = true;
        setTimeout(()=>{
            this._isRequesting = false;
        }, 3000);
    }

    cancel(): void {
        this._router.parent.navigate(["Dashboard"]);
    }

}
