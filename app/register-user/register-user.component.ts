import {Component} from "angular2/core";
import {CanActivate, Router} from "angular2/router";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {Response} from "angular2/http";
import {RegisterUserService} from "./register-user.service";

@Component({
    templateUrl: "app/register-user/register-user.component.html",
    styleUrls: ["app/register-user/styles.css"],
    providers: [RegisterUserService, HttpService]
})
@CanActivate(() => hasValidToken())
export class RegisterUserComponent {

    private _licenseKey: string = "";

    constructor(private _router: Router, private _service: RegisterUserService) {

    }

    getLicenseKey(expiration: string): void {
        this._service.getLicenseKey(expiration).subscribe((response: Response)=>{
            this._licenseKey = response.json().key;
        })
    }

    cancel(): void {
        this._router.parent.navigate(["Dashboard"]);
    }

}
