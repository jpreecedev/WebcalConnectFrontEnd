import {Injectable} from "angular2/core";
import {Http, Headers, Response, RequestMethod, RequestOptionsArgs} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {JwtHelper} from "./JwtHelper";
import {IJwt} from "./Jwt";

@Injectable()
export class HttpService {

    private _jwtHelper: JwtHelper;

    constructor(private _http: Http) {
        this._jwtHelper = new JwtHelper();
    }

    get(url: string): Promise<Response> {
        return this._request({ url: url, method: RequestMethod.Get, headers: this.getRequestHeaders(false) });
    }

    post(url: string, body: string): Promise<Response> {
        return this._request({ url: url, body: body, method: RequestMethod.Post, headers: this.getRequestHeaders(false) });
    }

    put(url: string, body: string): Promise<Response> {
        return this._request({ url: url, body: body, method: RequestMethod.Put, headers: this.getRequestHeaders(false) });
    }

    delete(url: string): Promise<Response> {
        return this._request({ url: url, method: RequestMethod.Delete, headers: this.getRequestHeaders(false) });
    }

    authenticate(username: string, password: string, rememberMe: boolean): Promise<boolean> {
        var creds: string = "username=" + username + "&password=" + password + "&grant_type=password&client_id=099153c2625149bc8ecb3e85e03f0022";

        return this._request({ url: "http://localhost:50139/oauth2/token", body: creds, method: RequestMethod.Post, headers: this.getRequestHeaders(true) })
            .then((response: Response) => {
                this._jwtHelper.setToken(response.json(), rememberMe);
                return true;
            })
            .then(() => {
                this._request({ url: "http://localhost:50139/api/user/roles", method: RequestMethod.Get, headers: this.getRequestHeaders(false) })
                    .then((response: Response) => {
                        this._jwtHelper.setRoles(response.json());
                    });
                return true;
            })
            .catch(this.handleError);
    }

    getRequestHeaders(isAuthenticating: boolean): Headers {
        var headers: Headers = new Headers();
        headers.append("Accept", "application/json");

        if (isAuthenticating) {
            headers.append("Content-Type", "application/x-www-form-urlencoded");
        } else {
            headers.append("Content-Type", "application/json");
        }

        var token: IJwt = this._jwtHelper.getToken();
        if (token && token.access_token) {
            headers.append("Authorization", "Bearer " + token.access_token);
        }

        return headers;
    }

    handleError<T>(error: Response): Observable<T> {
        console.error(error);
        return Observable.throw(error || "Server Error");
    }

    private _request(options: RequestOptionsArgs): Promise<Response> {
        return this._http.request(options.url, options).toPromise();
    }
}
