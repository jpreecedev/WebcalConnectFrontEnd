import { Component, OnInit } from 'angular2/core';
import { SoftwareLicensesService } from './software-licenses.service';
import { Client } from './client';
import { License } from './license';
import { TickPipe } from './tick.pipe';
import { ClientNamePipe } from './client-name.pipe';

@Component({
    templateUrl: 'app/software-licenses/software-licenses.component.html',
    styleUrls: ['app/software-licenses/styles.css'],
    providers: [SoftwareLicensesService],
    pipes: [TickPipe, ClientNamePipe]
})
export class SoftwareLicensesComponent implements OnInit {

    private clients: Client[];
    private selectedClient: Client;

    constructor(private service: SoftwareLicensesService) {
        this.selectedClient = ({} as Client);
    }

    ngOnInit(): void {

        this.service.getClients().then((response: Client[]) => {
            this.clients = response;
        });

    }

    addLicense(expiration: string): void {
        this.service.addLicense(this.selectedClient.accessId, expiration)
            .then((response: License) => {
                this.selectedClient.licenses.push(response);
            });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this.service.addClient(clientName)
            .then((response: Client) => {
                this.clients.push(response);
            });
    }

    selectClient(client: Client): void {
        this.selectedClient = client;
    }

    asDate(date: string): Date {
        return new Date(date);
    }
}
