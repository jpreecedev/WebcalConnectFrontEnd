import {Injectable} from "angular2/core";
import {Http, Headers, Response} from "angular2/http";
import {Observable} from "rxjs/Rx";
import {Cookie} from "ng2-cookies/ng2-cookies";

export interface IJwt {
    access_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable()
export class BaseService {

    constructor(protected _http: Http) {

    }

    getHeaders(): Headers {
        var headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");

        var token: IJwt = this.getToken();
        if (token && token.access_token) {
            headers.append("Authorization", "Bearer " + token.access_token);
        }

        return headers;
    }

    setToken(token: IJwt, rememberMe: boolean): void {
        Cookie.setCookie("token", JSON.stringify(token), rememberMe ? token.expires_in : undefined);
    }

    getToken(): IJwt {
        var cookie: string = Cookie.getCookie("token");
        if (cookie) {
            return JSON.parse(cookie);
        }
        return undefined;
    }

    handleError<T>(error: Response): Observable<T> {
        console.error(error);
        return Observable.throw(error || "Server Error");
    }
}
