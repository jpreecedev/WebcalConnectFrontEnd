import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";

@Injectable()
export class RegisterUserService {

    constructor(private _httpService: HttpService) {

    }

    getLicenseKey(expiration: string): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/licenses/license/${expiration}`);
    }

}
