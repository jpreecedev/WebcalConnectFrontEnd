import { Component, OnInit } from "angular2/core";
import { CanActivate } from "angular2/router";
import { SoftwareLicensesService } from "./software-licenses.service";
import { Client } from "./client";
import { License } from "./license";
import { TickPipe } from "./tick.pipe";
import { ClientNamePipe } from "./client-name.pipe";
import { Observable } from "rxjs/Rx";

@Component({
    templateUrl: "app/software-licenses/software-licenses.component.html",
    styleUrls: ["app/software-licenses/styles.css"],
    providers: [SoftwareLicensesService],
    pipes: [TickPipe, ClientNamePipe]
})
// @CanActivate(() => { return false; })
export class SoftwareLicensesComponent implements OnInit {

    private clients: Client[];
    private selectedClient: Client;
    private newLicenseExpiration: Date;

    constructor(private service: SoftwareLicensesService) {
        this.selectedClient = ({} as Client);
    }

    ngOnInit() {

        this.service.getClients().then((response: Client[]) => {
            this.clients = response;
        })

    }

    addLicense(expiration: string) {
        this.service.addLicense(this.selectedClient.accessId, expiration)
            .then((response: License) => {
                this.selectedClient.licenses.push(response);
            });
    }
    
    addClient(clientName: string) {
        if (!clientName) {
            return;
        }

        this.service.addClient(clientName)
            .then((response: Client) => {
                this.clients.push(response);
            });
    }

    selectClient(client: Client) {
        this.selectedClient = client;
    }

    asDate(date: string) {
        return new Date(date);
    }
}
