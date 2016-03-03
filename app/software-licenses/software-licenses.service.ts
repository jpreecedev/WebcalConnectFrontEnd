import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {Client} from "./client";
import {License} from "./license";
import {HttpService} from "../HttpService";

@Injectable()
export class SoftwareLicensesService {

    constructor(private _httpService: HttpService) {

    }

    addClient(clientName: string): Promise<Client> {
        return this._httpService.post("http://localhost:50139/api/licenses/client", JSON.stringify({ "name": clientName }))
            .then((response: Response) => response.json());
    }

    addLicense(accessId: string, expiration: string): Promise<License> {
        return this._httpService.post(`http://localhost:50139/api/licenses/license`, JSON.stringify({ accessId: accessId, expiration: expiration }))
            .then((response: Response) => <License>response.json());
    }

    getClients(): Promise<Client[]> {
        return this._httpService.get("http://localhost:50139/api/licenses/clients")
            .then((response: Response) => <Client[]>response.json());
    }

}
