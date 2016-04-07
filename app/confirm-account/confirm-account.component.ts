import {Component, OnInit} from "angular2/core";
import {Response, Http} from "angular2/http";
import {Router, RouteParams} from "angular2/router";
import {HttpService} from "../utilities/HttpService";
import {ConfirmAccountService} from "./confirm-account.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {ShowMessage, ShowError} from "../utilities/messageBox";
import {JwtHelper} from "../utilities/JwtHelper";

export interface ConfirmAccountTokens {
    userId: string;
    code: string;
}

@Component({
    templateUrl: "app/confirm-account/confirm-account.component.html",
    styleUrls: ["app/confirm-account/styles.css"],
    providers: [HttpService, ConfirmAccountService],
    directives: [SpinnerComponent]
})
export class ConfirmAccountComponent implements OnInit {

    private _isRequesting: boolean = false;
    private _tokens: ConfirmAccountTokens;

    constructor(private _service: ConfirmAccountService, private _router: Router, _routeParams: RouteParams) {
        var jwtHelper = new JwtHelper();
        jwtHelper.logout();
        
        this._tokens = {
            code: decodeURIComponent(_routeParams.get("code")),
            userId: _routeParams.get("userId")
        };
    }

    ngOnInit(): void {
        this._isRequesting = true;

        this._service.confirmEmail(this._tokens).subscribe(() => {
            ShowMessage("Your account has been activated, please now log in.");
            this._router.parent.navigate(["Login"]);
        },
        (error: any) => {
            this._isRequesting = false;
            ShowError("Unable to confirm the account activation process.  Please contact customer support.", error);
            this._router.parent.navigate(["Home"]);
        },
        () => {
            this._isRequesting = false;
        });
    }
}
