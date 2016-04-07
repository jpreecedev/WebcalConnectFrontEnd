import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {ConfirmAccountTokens} from "./confirm-account.component.ts";

@Injectable()
export class ConfirmAccountService {

    constructor(private _httpService: HttpService) {

    }

    confirmEmail(tokens: ConfirmAccountTokens): Observable<Response> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/confirmaccount/`, JSON.stringify(tokens));
    }

}
