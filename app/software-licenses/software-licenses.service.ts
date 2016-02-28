import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Client} from "./client";
import {License} from "./license";

@Injectable()
export class SoftwareLicensesService {

    constructor(private http: Http) {

    }

    addClient(clientName: string) {
        return new Promise<License>(resolve => {
            var headers = new Headers();
            headers.append("Content-Type", "application/json");

            this.http.post(`/api/Licenses/AddClient?name=${clientName}`, null, headers)
                .subscribe((response) => {
                    resolve(response.json());
                });
        });
    }

    addLicense(clientAccessId: string, expiration: string) {

        return new Promise<License>(resolve => {
            var headers = new Headers();
            headers.append("Content-Type", "application/json");

            this.http.post(`/api/Licenses/AddLicense?clientId=${clientAccessId}&expiration=${expiration}`, null, headers)
                .subscribe((response) => {
                    resolve(response.json());
                });
        });
    }

    getClients() {
        return new Promise<Client[]>(resolve => {
            this.http.get("/api/Licenses")
                .subscribe((response) => {
                    resolve(response.json());
                });
        });
    }

}