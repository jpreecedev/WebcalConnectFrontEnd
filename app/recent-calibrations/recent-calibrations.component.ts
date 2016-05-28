import {Component, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../utilities/HttpService";
import {RecentCalibrationsService} from "./recent-calibrations.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {DatePickerComponent} from "../utilities/date-picker/date-picker.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {DepotNamePipe} from "./depot-name.pipe";
import {CsvHelper} from "../utilities/csv.helper";
import {ShowMessage, ShowError, ShowDialog} from "../utilities/messageBox";
import {Observable} from "rxjs/Observable";

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
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent, DatePickerComponent]
})
export class RecentCalibrationsComponent implements OnInit {

    public selectedDepotName: string;
    public from: string;
    public to: string;

    private recentCalibrations: RecentCalibration[];
    private isRequesting: boolean;
    private isDownloading: boolean = false;
    private isEmailing: boolean = false;
    private depotNames: string[];

    private page: number = 1;

    constructor(private service: RecentCalibrationsService) {
        var d = new Date();
        d.setDate(d.getDate() - 28);
        this.from = d.toISOString().split("T")[0];
        this.to = new Date().toISOString().split("T")[0];
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        this.isRequesting = true;
        this.service.getRecent(this.from, this.to, this.selectedDepotName).subscribe((response: Response) => {
            this.recentCalibrations = response.json();
            this.depotNames = this.getDepotNames();
            this.depotNames.unshift("- All -");
            this.selectedDepotName = "- All -";
            this.isRequesting = false;
        },
        (error: any) => {
            this.isRequesting = false;
            ShowError("Unable to get list of recent calibrations, please try again later.", error);
        },
        () => {
            this.isRequesting = false;
        });
    }

    getDepotNames(): string[] {
        if (!this.recentCalibrations) {
            return;
        }
        var depotNames: Array<string> = new Array<string>();
        for (var index: number = 0; index < this.recentCalibrations.length; index++) {
            var element: RecentCalibration = this.recentCalibrations[index];
            if (element.depotName && depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    private getGridData(): RecentCalibration[] {
        return this.recentCalibrations.filter((item: RecentCalibration) => {
            if (!this.selectedDepotName) {
                return true;
            }
            return this.selectedDepotName === "- All -" || item.depotName === this.selectedDepotName;
        })
            .slice((this.page - 1) * 10, ((this.page - 1) * 10) + 10);
    }

    downloadCertificate($event: Event, selectedCalibration: RecentCalibration): void {
        if (!selectedCalibration || $event.defaultPrevented) {
            return;
        }

        this.service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
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
                $this.service.emailCertificate(email, selectedCalibration).subscribe();
                ShowMessage("Your email has been sent.");
            }
        });
    }

    downloadGridData(): void {
        this.isDownloading = true;
        var csvHelper: CsvHelper = new CsvHelper();
        csvHelper.download(this.getGridData(), this.page, this.selectGridData);
        this.isDownloading = false;
    }

    emailGridData(): void {
        var $this: RecentCalibrationsComponent = this;
        this.showDialog(function() {
            var email: string = this.find("#email").val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this.isEmailing = true;
                $this.service.emailGridData(email, $this.getGridData()).subscribe();
                ShowMessage("Your email has been sent.");
            }
            $this.isEmailing = false;
        });
    }

    asDate(input: string): Date {
        return new Date(input);
    }
    
    fromChanged(from: string){
        this.from = from;
    }
    
    toChanged(to: string){
        this.to = to;
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
