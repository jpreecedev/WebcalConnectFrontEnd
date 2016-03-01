import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Client} from './client';
import {License} from './license';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SoftwareLicensesService {

    constructor(private _http: Http) {

    }

    addClient(clientName: string): Promise<Client> {
        return this._http.post('http://localhost:50139/api/licenses/client', JSON.stringify({ 'name': clientName }), { headers: this.getHeaders() })
            .map((response: Response) => response.json())
            .catch(this.handleError)
            .toPromise();
    }

    addLicense(accessId: string, expiration: string): Promise<License> {
        return this._http.post(`http://localhost:50139/api/licenses/license`, JSON.stringify({ accessId: accessId, expiration: expiration }), { headers: this.getHeaders() })
            .map((response: Response) => <License>response.json())
            .catch(this.handleError)
            .toPromise();
    }

    getClients(): Promise<Client[]> {
        return this._http.get('http://localhost:50139/api/licenses/clients', { headers: this.getHeaders() })
            .map((response: Response) => <Client[]>response.json())
            .toPromise()
            .catch(this.handleError);
    }

    getHeaders(): Headers {
        var headers: Headers = new Headers();
        headers.append('Authorization', 'Basic dXNlcjpwYXNzd29yZA==');
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

    handleError<T>(error: Response): Observable<T> {
        console.error(error);
        return Observable.throw(error || 'Server Error');
    }

}
