import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {License, Client} from "./software-licenses.component";

@Injectable()
export class SoftwareLicensesService {

    constructor(private _httpService: HttpService) {

    }

    addClient(clientName: string): Observable<Client> {
        return this._httpService.post("http://localhost:50139/api/licenses/client", JSON.stringify({ "name": clientName }))
            .map((response: Response) => {
                return response.json();
            });
    }

    addLicense(accessId: string, expiration: string): Observable<License> {
        return this._httpService.post(`http://localhost:50139/api/licenses/license`, JSON.stringify({ accessId: accessId, expiration: expiration }))
            .map((response: Response) => {
                return response.json();
            });
    }

    getClients(): Observable<Client[]> {
        return this._httpService.get("http://localhost:50139/api/licenses/clients")
            .map((response: Response) => {
                return response.json();
            });
    }

}
