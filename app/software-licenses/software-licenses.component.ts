import { Component, OnInit } from "angular2/core";
import { CanActivate } from "angular2/router";
import { SoftwareLicensesService } from "./software-licenses.service";
import { Client } from "./client";
import { License } from "./license";
import { TickPipe } from "./tick.pipe";
import { ClientNamePipe } from "./client-name.pipe";
import { hasValidToken } from "../utilities/Jwt";
import { HttpService } from "../utilities/HttpService";

@Component({
    templateUrl: "app/software-licenses/software-licenses.component.html",
    styleUrls: ["app/software-licenses/styles.css"],
    providers: [SoftwareLicensesService, HttpService],
    pipes: [TickPipe, ClientNamePipe]
})
@CanActivate(() => hasValidToken(["Administrator"]))
export class SoftwareLicensesComponent implements OnInit {

    private clients: Client[];
    private selectedClient: Client;

    constructor(private _service: SoftwareLicensesService) {
        this.selectedClient = ({} as Client);
    }

    ngOnInit(): void {

        this._service.getClients().then((response: Client[]) => {
            this.clients = response;
        });

    }

    addLicense(expiration: string): void {
        this._service.addLicense(this.selectedClient.accessId, expiration)
            .then((response: License) => {
                this.selectedClient.licenses.push(response);
            });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this._service.addClient(clientName)
            .then((response: Client) => {
                this.clients.push(response);
            });
    }

    selectClient(client: Client): void {
        this.selectedClient = client;
    }
    
    asDate(input:string){
        return new Date(input);
    }
}
