import {Component, OnInit} from "angular2/core";
import {SoftwareLicensesService} from "./software-licenses.service";
import {TickPipe} from "../utilities/tick.pipe";
import {ClientNamePipe} from "./client-name.pipe";
import {HttpService} from "../utilities/HttpService";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {ShowError} from "../utilities/messageBox";

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
    directives: [SpinnerComponent, PaginationControlsCmp]
})
export class SoftwareLicensesComponent implements OnInit {

    private _clients: Client[];
    private _selectedClient: Client;
    private _isRequesting: boolean;
    
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
        this._service.addLicense(this._selectedClient.accessId, expiration).subscribe((response: License) => {
                this._selectedClient.licenses.unshift(response);
                this._newLicenseExpiration = "";
            },
            (error: any) => {
                ShowError("Unable to add license, please try again later.", error);   
            });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this._service.addClient(clientName).subscribe((response: Client) => {
                this._clients.unshift(response);
                this._newClientName = "";
            },
            (error: any) => {
                ShowError("Unable to add client, please try again later.", error);
            });
    }

    selectClient(client: Client): void {
        this._selectedClient = client;
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
