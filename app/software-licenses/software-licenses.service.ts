import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Client} from "./client";
import {License} from "./license";
import {BaseService} from "../base.service";

@Injectable()
export class SoftwareLicensesService extends BaseService {

    constructor(_http: Http) {
        super(_http);
    }

    addClient(clientName: string): Promise<Client> {
        return this._http.post("http://localhost:50139/api/licenses/client", JSON.stringify({ "name": clientName }), { headers: this.getHeaders() })
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
        return this._http.get("http://localhost:50139/api/licenses/clients", { headers: this.getHeaders() })
            .map((response: Response) => <Client[]>response.json())
            .toPromise()
            .catch(this.handleError);
    }

}
