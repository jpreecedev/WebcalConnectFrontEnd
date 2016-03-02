import {Injectable} from "angular2/core";
import {Http, Headers, Response} from "angular2/http";
import {BaseService, IJwt} from "../base.service";

@Injectable()
export class LoginService extends BaseService {

    constructor(_http: Http) {
        super(_http);
    }

    authenticate(username: string, password: string, rememberMe: boolean): Promise<boolean> {
        var creds: string = "username=" + username + "&password=" + password + "&grant_type=password&client_id=099153c2625149bc8ecb3e85e03f0022";

        var headers: Headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this._http.post("http://localhost:50139/oauth2/token", creds, { headers: headers })
            .map((response: Response) => {
                this.setToken(<IJwt>response.json(), rememberMe);
                return true;
            })
            .toPromise();
    }

}
