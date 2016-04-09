import {Component, OnInit} from "angular2/core";
import {Response} from "angular2/http";
import {SoftwareLicensesService} from "./software-licenses.service";
import {TickPipe} from "../utilities/tick.pipe";
import {ClientNamePipe} from "./client-name.pipe";
import {HttpService} from "../utilities/HttpService";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {ShowError} from "../utilities/messageBox";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";

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
    templateUrl: "app/software-licenses/software-licenses.component.html",
    styleUrls: ["app/software-licenses/styles.css"],
    providers: [SoftwareLicensesService, HttpService, PaginationService],
    pipes: [TickPipe, ClientNamePipe, PaginatePipe],
    directives: [SpinnerComponent, WCButtonComponent, PaginationControlsCmp]
})
export class SoftwareLicensesComponent implements OnInit {

    private _clients: Client[];
    private _selectedClient: Client;
    private _isRequesting: boolean;
    private _isAdding: boolean;
    private _isAddingLicense: boolean;
    private _isDeletingLicense: boolean;
    private _isDeletingClient: boolean;

    private _newClientName: string;
    private _newLicenseExpiration: string;

    constructor(private _service: SoftwareLicensesService) {
        this._selectedClient = ({} as Client);
    }

    ngOnInit(): void {

        this._isRequesting = true;
        this._service.getClients().subscribe((response: Client[]) => {
            this._clients = response;
        },
        (error: any) => {
            ShowError("Unable to get list of clients, please try again later.", error);
            this._isRequesting = false;
        },
        () => {
            this._isRequesting = false;
        });
    }

    addLicense(expiration: string): void {
        if (!expiration){
            return;
        }
        
        this._isAddingLicense = true;
        this._service.addLicense(this._selectedClient.accessId, expiration).subscribe((response: License) => {
            this._selectedClient.licenses.unshift(response);
        },
        (error: any) => {
            ShowError("Unable to add license, please try again later.", error);
            this._newLicenseExpiration = "";
            this._isAddingLicense = false;
        },
        () => {
            this._newLicenseExpiration = "";
            this._isAddingLicense = false;
        });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this._isAdding = true;
        this._service.addClient(clientName).subscribe((response: Client) => {
            this._clients.unshift(response);
        },
        (error: any) => {
            ShowError("Unable to add client, please try again later.", error);
            this._isAdding = false;
            this._newClientName = "";
        },
        () => {
            this._isAdding = false;
            this._newClientName = "";
        });
    }

    deleteLicense(client: Client, license: License) {
        this._isDeletingLicense = true;
        this._service.deleteLicense(client, license).subscribe((response: Response) => {
            var index = client.licenses.indexOf(license);
            if (index > -1){
                client.licenses.splice(index, 1);
            }
        },
        (error: any) => {
            ShowError("Unable to delete license, please try again later.", error);
            this._isDeletingLicense = false;
        },
        () => {
            this._isDeletingLicense = false;
        });
    }

    deleteClient(client: Client) {
        this._isDeletingClient = true;
        this._service.deleteClient(client).subscribe((response: Response) => {
            var index = this._clients.indexOf(client);
            if (index > -1){
                this._clients.splice(index, 1);
            }
        },
        (error: any) => {
            ShowError("Unable to delete client, please try again later.", error);
            this._isDeletingClient = false;
        },
        () => {
            this._isDeletingClient = false;
        });
    }

    selectClient(client: Client): void {
        this._selectedClient = client;
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
