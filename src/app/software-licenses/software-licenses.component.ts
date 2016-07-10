import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { SoftwareLicensesService } from './software-licenses.service';
import { TickPipe } from '../utilities/tick.pipe';
import { ClientNamePipe } from './client-name.pipe';
import { HttpService } from '../utilities/http.service';
import { SpinnerComponent } from '../utilities/spinner/spinner.component';
import { PaginatePipe, PaginationControlsCmp, IPaginationInstance } from 'ng2-pagination';
import { ShowError } from '../utilities/messageBox';
import { WCButtonComponent } from '../utilities/wc-button/wc-button.component';
import { DatePickerComponent } from '../utilities/date-picker/date-picker.component';

export interface License {
    expiration: Date;
    hasExpired: boolean;
    license: string;
    accessId: string;
}

export interface Client {
    name: string;
    expiration: string;
    accessId: string;
    licenses: License[];
}

@Component({
    templateUrl: './software-licenses.component.html',
    styleUrls: ['./styles.scss'],
    providers: [SoftwareLicensesService, HttpService],
    pipes: [TickPipe, ClientNamePipe, PaginatePipe],
    directives: [SpinnerComponent, WCButtonComponent, PaginationControlsCmp, DatePickerComponent]
})
export class SoftwareLicensesComponent implements OnInit {

    public paginationConfig: IPaginationInstance = {
        id: 'softwareLicenses',
        itemsPerPage: 10,
        currentPage: 1
    };

    private clients: Client[];
    private selectedClient: Client;
    private isRequesting: boolean;
    private isAdding: boolean;
    private isAddingLicense: boolean;
    private isDeletingLicense: boolean;
    private isDeletingClient: boolean;

    private newClientName: string;
    private newLicenseExpiration: string;

    constructor(private service: SoftwareLicensesService) {
        this.selectedClient = ({} as Client);
    }

    ngOnInit(): void {

        this.isRequesting = true;
        this.service.getClients().subscribe((response: Client[]) => {
            this.clients = response;
        },
        (error: any) => {
            ShowError('Unable to get list of clients, please try again later.', error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    addLicense(expiration: string): void {
        if (!expiration) {
            return;
        }

        this.isAddingLicense = true;
        this.service.addLicense(this.selectedClient.accessId, expiration).subscribe((response: License) => {
            this.selectedClient.licenses.unshift(response);
        },
        (error: any) => {
            ShowError('Unable to add license, please try again later.', error);
            this.newLicenseExpiration = '';
            this.isAddingLicense = false;
        },
        () => {
            this.newLicenseExpiration = '';
            this.isAddingLicense = false;
        });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this.isAdding = true;
        this.service.addClient(clientName).subscribe((response: Client) => {
            this.clients.unshift(response);
        },
        (error: any) => {
            ShowError('Unable to add client, please try again later.', error);
            this.isAdding = false;
            this.newClientName = '';
        },
        () => {
            this.isAdding = false;
            this.newClientName = '';
        });
    }

    deleteLicense(client: Client, license: License): void {
        this.isDeletingLicense = true;
        this.service.deleteLicense(client, license).subscribe((response: Response) => {
            let index = client.licenses.indexOf(license);
            if (index > -1) {
                client.licenses.splice(index, 1);
            }
        },
        (error: any) => {
            ShowError('Unable to delete license, please try again later.', error);
            this.isDeletingLicense = false;
        },
        () => {
            this.isDeletingLicense = false;
        });
    }

    deleteClient(client: Client): void {
        this.isDeletingClient = true;
        this.service.deleteClient(client).subscribe((response: Response) => {
            let index = this.clients.indexOf(client);
            if (index > -1) {
                this.clients.splice(index, 1);
            }
        },
        (error: any) => {
            ShowError('Unable to delete client, please try again later.', error);
            this.isDeletingClient = false;
        },
        () => {
            this.isDeletingClient = false;
        });
    }

    selectClient(client: Client): void {
        this.selectedClient = client;
    }

    expirationChanged(date: string): void {
        this.newLicenseExpiration = date;
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
