import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {Response, Http} from "angular2/http";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {CentreCheckService} from "./centre-check.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {TickPipe} from "../utilities/tick.pipe";
import {ShowError} from "../utilities/messageBox";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

export interface CentreCheck {
    centreName: string;
    sealNumber: string;
    date: string;
    name: string;
    documentId: number;
    documentTypeEnum: string;
}

@Component({
    templateUrl: "app/centre-check/centre-check.component.html",
    styleUrls: ["app/centre-check/styles.css"],
    providers: [CentreCheckService, HttpService, PaginationService],
    pipes: [PaginatePipe, TickPipe],
    directives: [SpinnerComponent, PaginationControlsCmp]
})
@CanActivate(() => hasValidToken())
export class CentreCheckComponent implements OnInit {

    private _centreChecks: CentreCheck[];
    private _isRequesting: boolean;

    constructor(private _service: CentreCheckService, private _http: Http) {
    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getCentreChecks().subscribe((response: Response) => {
            this._centreChecks = response.json();
        },
        (error: any) => {
            ShowError("Unable to get list of centre checks, please try again later.", error);
            this._isRequesting = false;
        },
        () => {
            this._isRequesting = false;            
        });
    }

    downloadPdf($event: Event, selectedCentreCheck: CentreCheck): void {
        if (!selectedCentreCheck || $event.defaultPrevented) {
            return;
        }

        this._service.downloadPdf(selectedCentreCheck.documentId, selectedCentreCheck.documentTypeEnum);
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
