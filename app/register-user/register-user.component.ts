import {Component} from "angular2/core";
import {CanActivate, Router} from "angular2/router";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {Response} from "angular2/http";
import {RegisterUserService} from "./register-user.service";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {ShowMessage, ShowError} from "../utilities/messageBox";

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
    directives: [WCButtonComponent]
})
@CanActivate(() => hasValidToken(["Administrator"]))
export class RegisterUserComponent {

    private _userRegistration: UserRegistration;
    private _isRequesting: boolean = false;

    constructor(private _router: Router, private _service: RegisterUserService) {
        this.resetForm();
    }

    getLicenseKey(expiration: string): void {
        this._service.getLicenseKey(expiration).subscribe((response: Response) => {
            this._userRegistration.licenseKey = response.json().key;
        });
    }

    submit(): void {
        this._isRequesting = true;
        this._service.registerUser(this._userRegistration).subscribe(() => {
            this.resetForm();
            ShowMessage("The user was registered successfully");
        }, 
        (error: any) => {
            this._isRequesting = false;
            ShowError("Unable to register user, please try again later.", error);;
        }, 
        () => {
            this._isRequesting = false;
        });
    }

    cancel(): void {
        this._router.parent.navigate(["Dashboard"]);
    }

    resetForm(): void {
        this._userRegistration = {
            emailAddress: "",
            companyName: "",
            expiration: "",
            licenseKey: ""
        };
    }

}
