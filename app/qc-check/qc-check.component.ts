import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {Response, Http} from "angular2/http";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {QCCheckService} from "./qc-check.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {TickPipe} from "../utilities/tick.pipe";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {ShowError} from "../utilities/messageBox";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

export interface QCCheck {
    centreName: string;
    date: string;
    threeChecksCompleted: boolean;
    managerName: string;
    technician: string;
    documentId: number;
    documentTypeEnum: string;
}

@Component({
    templateUrl: "app/qc-check/qc-check.component.html",
    styleUrls: ["app/qc-check/styles.css"],
    providers: [QCCheckService, HttpService, PaginationService],
    pipes: [PaginatePipe, TickPipe],
    directives: [SpinnerComponent, PaginationControlsCmp]
})
@CanActivate(() => hasValidToken())
export class QCCheckComponent implements OnInit {

    public selectedDepotName: string;

    private _qcChecks: QCCheck[];
    private _isRequesting: boolean;

    constructor(private _service: QCCheckService, private _http: Http) {

    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getQCChecks().subscribe((response: Response) => {
            this._qcChecks = response.json();
        },
        (error: any) =>{
            ShowError("Unable to get a list of QC checks, please try again later.", error);
            this._isRequesting = false;            
        },
        () => {
            this._isRequesting = false;            
        });
    }

    downloadPdf($event: Event, selectedQCCheck: QCCheck): void {
        if (!selectedQCCheck || $event.defaultPrevented) {
            return;
        }

        this._service.downloadPdf(selectedQCCheck.documentId, selectedQCCheck.documentTypeEnum);
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
