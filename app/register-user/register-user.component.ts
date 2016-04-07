import {Component} from "angular2/core";
import {CanActivate, Router} from "angular2/router";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {Response} from "angular2/http";
import {RegisterUserService} from "./register-user.service";
import {AnimatedButtonComponent} from "../utilities/animated-button/animated-button.component";
import {Bootbox} from "../utilities/bootbox";

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
        this.resetForm();
    }

    getLicenseKey(expiration: string): void {
        this._service.getLicenseKey(expiration).subscribe((response: Response) => {
            this._userRegistration.licenseKey = response.json().key;
        });
    }

    submit(): void {
        var bootbox: Bootbox = (<any>window).bootbox;

        this._isRequesting = true;
        this._service.registerUser(this._userRegistration).subscribe(() => {
            bootbox.alert("The user was registered successfully");
            this.resetForm();
        }, (error: any) => {
            bootbox.alert(`An error has occurred. ${error.json().message}`);
            this._isRequesting = false;
        }, () => {
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
