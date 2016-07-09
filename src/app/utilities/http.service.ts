import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from './JwtHelper';
import { IJwt } from './Jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AppSettings } from '../app.settings';

export interface PagedResponse<T> {
    total: number;
    data: T[];
}

@Injectable()
export class HttpService {

    constructor(private http: Http, private jwtHelper: JwtHelper) {

    }

    get(url: string): Observable<Response> {
        return this._request({ url: url, method: RequestMethod.Get, headers: this.getRequestHeaders(false) });
    }

    post(url: string, body: string): Observable<Response> {
        return this._request({ url: url, body: body, method: RequestMethod.Post, headers: this.getRequestHeaders(false) });
    }

    put(url: string, body: string): Observable<Response> {
        return this._request({ url: url, body: body, method: RequestMethod.Put, headers: this.getRequestHeaders(false) });
    }

    delete(url: string, body: string): Observable<Response> {
        return this._request({ url: url, body: body, method: RequestMethod.Delete, headers: this.getRequestHeaders(false) });
    }

    authenticate(username: string, password: string, rememberMe: boolean): Observable<boolean> {
        let creds: string = 'username=' + username + '&password=' + password + '&grant_type=password&client_id=099153c2625149bc8ecb3e85e03f0022';

        return this._request({ url: `${AppSettings.SERVER_ADDRESS}/oauth2/token`, body: creds, method: RequestMethod.Post, headers: this.getRequestHeaders(true) })
            .do((response: Response) => {
                this.jwtHelper.setToken(response.json(), rememberMe);
            })
            .map((res: Response) => {
                if (res.status === 200) {
                    return true;
                }
                return false;
            });
    }

    getRequestHeaders(isAuthenticating: boolean): Headers {
        let headers: Headers = new Headers();
        headers.append('Accept', 'application/json');

        if (isAuthenticating) {
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            headers.append('Content-Type', 'application/json');

            let token: IJwt = this.jwtHelper.getToken();
            if (token && token.access_token) {
                headers.append('Authorization', 'Bearer ' + token.access_token);
            }
        }

        return headers;
    }

    handleError<T>(error: Response): Observable<T> {
        console.error(error);
        return Observable.throw(error || 'Server Error');
    }

    private _request(options: RequestOptionsArgs): Observable<Response> {
        return this.http.request(options.url, options);
    }
}
