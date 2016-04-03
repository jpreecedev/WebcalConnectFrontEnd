import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {SoftwareLicensesService} from "./software-licenses.service";
import {TickPipe} from "./tick.pipe";
import {ClientNamePipe} from "./client-name.pipe";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp, IPaginationInstance} from "ng2-pagination";

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
@CanActivate(() => hasValidToken(["Administrator"]))
export class SoftwareLicensesComponent implements OnInit {

    private _clients: Client[];
    private _selectedClient: Client;
    private _isRequesting: boolean;
    private _page: number = 1;
    
    private _newClientName: string;
    private _newLicenseExpiration: string;

    constructor(private _service: SoftwareLicensesService) {
        this._selectedClient = ({} as Client);
    }

    ngOnInit(): void {

        this._isRequesting = true;
        this._service.getClients().subscribe((response: Client[]) => {
            this._isRequesting = false;
            this._clients = response;
        });

    }

    addLicense(expiration: string): void {
        this._service.addLicense(this._selectedClient.accessId, expiration)
            .subscribe((response: License) => {
                this._selectedClient.licenses.unshift(response);
                this._newLicenseExpiration = "";
            });
    }

    addClient(clientName: string): void {
        if (!clientName) {
            return;
        }

        this._service.addClient(clientName)
            .subscribe((response: Client) => {
                this._clients.unshift(response);
                this._newClientName = "";
            });
    }

    selectClient(client: Client): void {
        this._selectedClient = client;
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
