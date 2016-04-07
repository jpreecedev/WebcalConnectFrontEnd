import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {Response} from "angular2/http";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {RecentCalibrationsService} from "./recent-calibrations.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {DepotNamePipe} from "./depot-name.pipe";
import {CsvHelper} from "../utilities/csv.helper";
import {ShowMessage, ShowDialog} from "../utilities/messageBox";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

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
    pipes: [PaginatePipe, DepotNamePipe],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent]
})
@CanActivate(() => hasValidToken())
export class RecentCalibrationsComponent implements OnInit {

    public selectedDepotName: string;

    private _recentCalibrations: RecentCalibration[];
    private _depotNames: string[];
    private _isRequesting: boolean;
    private _page: number = 1;
    private _isDownloading: boolean = false;
    private _isEmailing: boolean = false;

    constructor(private _service: RecentCalibrationsService) {

    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getRecent().subscribe((response: Response) => {
            this._recentCalibrations = response.json();
            this._depotNames = this.getDepotNames();
            this._isRequesting = false;
        });
    }

    getDepotNames(): string[] {
        if (!this._recentCalibrations) {
            return;
        }
        var depotNames: Array<string> = new Array<string>();
        for (var index: number = 0; index < this._recentCalibrations.length; index++) {
            var element: RecentCalibration = this._recentCalibrations[index];
            if (depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
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
        csvHelper.download(this.getGridData(), this._page, this.selectGridData);
        this._isDownloading = false;
    }

    emailGridData(): void {
        var $this: RecentCalibrationsComponent = this;
        $this._isEmailing = true;
        this.showDialog(function() {
            var email: string = this.find("#email").val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this._service.emailGridData(email, $this.getGridData()).subscribe();
                ShowMessage("Your email has been sent.");
            }
            $this._isEmailing = false;
        });
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    private getGridData(): RecentCalibration[] {
        return this._recentCalibrations.filter((item: RecentCalibration) => {
            if (!this.selectedDepotName) {
                return true;
            }
            return item.depotName === this.selectedDepotName;
        })
            .slice((this._page - 1) * 10, ((this._page - 1) * 10) + 10);
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
