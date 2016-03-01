import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export interface IJwt {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class BaseService {

    constructor(protected _http: Http) {

    }

    getHeaders(): Headers {
        var headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        
        var token = this.getToken();
        if (token && token.access_token){
            headers.append("Authorization", "Bearer " + token.access_token);
        }
        
        return headers;
    }
    
    setToken(token: IJwt){
        sessionStorage.setItem("token", JSON.stringify(token));
    }
    
    getToken(){
        return JSON.parse(sessionStorage.getItem("token"));
    }

    handleError<T>(error: Response): Observable<T> {
        console.error(error);
        return Observable.throw(error || 'Server Error');
    }
}