import {Injectable} from "angular2/core";
import {Http, Headers, Response} from "angular2/http";
import {Client} from "./client";
import {License} from "./license";
import {Observable} from "rxjs/Rx";

@Injectable()
export class SoftwareLicensesService {

    constructor(private _http: Http) {

    }

    addClient(clientName: string) {
        var body = { "name": clientName };

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post("http://localhost:50139/api/licenses/client", JSON.stringify(body), { headers: headers })
            .map((response: Response) => response.json())
            .catch(this.handleError)
            .toPromise();
    }

    addLicense(accessId: string, expiration: string) {
        var body = {
            accessId: accessId,
            expiration: expiration
        };

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post(`http://localhost:50139/api/licenses/license`, JSON.stringify(body), { headers: headers })
            .map((response: Response) => <License>response.json())
            .catch(this.handleError)
            .toPromise();
    }

    getClients() {
        return this._http.get("http://localhost:50139/api/licenses/clients")
            .map((response: Response) => <Client[]>response.json())
            .toPromise()
            .catch(this.handleError);
    }

    handleError(error: Response) {
        console.error(error);
        return Observable.throw(error || "Server Error");
    }

}