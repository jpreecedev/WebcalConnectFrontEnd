import {Component, OnInit} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {RecentCalibrationsService} from "./recent-calibrations.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {DepotNamePipe} from "./depot-name.pipe";
import {CsvHelper} from "../utilities/csv.helper";
import {ShowMessage, ShowError, ShowDialog} from "../utilities/messageBox";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";

export interface RecentCalibration {
    companyName: string;
    documentType: string;
    documentIcon: string;
    expiration: string;
    registration: string;
    technician: string;
    customer: string;
    depotName: string;
    documentId: number;
    documentTypeEnum: string;
}

@Component({
    templateUrl: "app/recent-calibrations/recent-calibrations.component.html",
    styleUrls: ["app/recent-calibrations/styles.css"],
    providers: [RecentCalibrationsService, HttpService, PaginationService],
    pipes: [PaginatePipe],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent]
})
export class RecentCalibrationsComponent implements OnInit {

    private _recentCalibrations: Observable<RecentCalibration[]>;
    private _data: RecentCalibration[];
    private _isRequesting: boolean;
    private _isDownloading: boolean = false;
    private _isEmailing: boolean = false;

    private _filterValue: string;
    private _isSearching: boolean = false;
    private _page: number = 1;
    private _total: number = 0;

    constructor(private _service: RecentCalibrationsService) {

    }

    ngOnInit(): void {
        this.getPage(1);
    }

    search() {
        this._isSearching = true;
        this.getPage(1);
    }

    getPage(page: number) {
        this._isRequesting = true;
        this._recentCalibrations = this._service.getRecent(page, 20, this._filterValue)
        .do((response: Response) => {
            this._total = response.json().total;
            this._data = response.json().data;
            this._page = page;
            this._isRequesting = false;
            this._isSearching = false;
        })
        .map((response: Response) => response.json().data)
        .catch((error: any) => {
            ShowError("Unable to get list of recent calibrations, please try again later.", error);
            this._isRequesting = false;
            this._isSearching = false;
            return null;
        });
    }

    downloadCertificate($event: Event, selectedCalibration: RecentCalibration): void {
        if (!selectedCalibration || $event.defaultPrevented) {
            return;
        }

        this._service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
    }

    emailCertificate($event: Event, selectedCalibration: RecentCalibration): void {
        if (!selectedCalibration) {
            return;
        }
        $event.preventDefault();

        var $this: RecentCalibrationsComponent = this;
        this.showDialog(function() {
            var email: string = this.find("#email").val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this._service.emailCertificate(email, selectedCalibration).subscribe();
                ShowMessage("Your email has been sent.");
            }
        });
    }

    downloadGridData(): void {
        this._isDownloading = true;
        var csvHelper: CsvHelper = new CsvHelper();
        csvHelper.download(this._data, this._page, this.selectGridData);
        this._isDownloading = false;
    }

    emailGridData(): void {
        var $this: RecentCalibrationsComponent = this;
        this.showDialog(function() {
            var email: string = this.find("#email").val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this._isEmailing = true;
                $this._service.emailGridData(email, $this._data).subscribe();
                ShowMessage("Your email has been sent.");
            }
            $this._isEmailing = false;
        });
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    private selectGridData(item: RecentCalibration): Array<any> {
        return [item.companyName,
            item.documentType,
            new Date(item.expiration).toDateString(),
            item.registration,
            item.technician,
            item.customer];
    }

    private showDialog(callback: Function): void {
        ShowDialog({
            title: "Enter the email address of the recipient",
            message: "<div class=\"row\">  " +
            "<div class=\"col-md-12\"> " +
            "<form class=\"form-horizontal\"> " +
            "<input id=\"email\" name=\"email\" type=\"email\" placeholder=\"you@yourcompany.com\" class=\"form-control\" required> " +
            "</form> </div> </div>",
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: callback
                },
                success: {
                    label: "Send Email",
                    className: "btn-primary",
                    callback: callback
                }
            }
        });
    }
}
