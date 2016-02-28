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
        return this._http.post(`http://localhost:50579/api/Licenses/AddClient?name=${clientName}`, null)
            .map((response: Response) => response.json())
            .catch(this.handleError)
            .toPromise();
    }

    addLicense(clientAccessId: string, expiration: string) {
        return this._http.post(`http://localhost:50579/api/Licenses/AddLicense?clientId=${clientAccessId}&expiration=${expiration}`, null)
            .map((response: Response) => <License>response.json())
            .catch(this.handleError)
            .toPromise();
    }

    getClients() {
        return this._http.get("http://localhost:50579/api/Licenses")
            .map((response: Response) => <Client[]>response.json())
            .toPromise()
            .catch(this.handleError);
    }

    handleError(error: Response) {
        console.error(error);
        return Observable.throw(error || "Server Error");
    }

}