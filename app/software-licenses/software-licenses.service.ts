import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {License, Client} from "./software-licenses.component";
import {AppSettings} from "../app.settings";

@Injectable()
export class SoftwareLicensesService {

    constructor(private httpService: HttpService) {

    }

    addClient(clientName: string): Observable<Client> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/licenses/client`, JSON.stringify({ "name": clientName }))
            .map((response: Response) => {
                return response.json();
            });
    }

    addLicense(accessId: string, expiration: string): Observable<License> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/licenses/license`, JSON.stringify({ accessId: accessId, expiration: expiration }))
            .map((response: Response) => {
                return response.json();
            });
    }
    
    deleteClient(client: Client):Observable<Response>{
        return this.httpService.delete(`${AppSettings.API_ENDPOINT}/licenses/client`, JSON.stringify({ clientAccessId: client.accessId }));
    }
    
    deleteLicense(client: Client, license: License):Observable<Response>{
        return this.httpService.delete(`${AppSettings.API_ENDPOINT}/licenses/license`, JSON.stringify({ clientAccessId: client.accessId, licenseAccessId: license.accessId }));
    }

    getClients(): Observable<Client[]> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/licenses/clients`)
            .map((response: Response) => {
                return response.json();
            });
    }

}
