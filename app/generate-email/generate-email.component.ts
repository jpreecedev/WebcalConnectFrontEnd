import {Component, OnInit} from "angular2/core";
import {isAdministrator} from "../utilities/Jwt";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {GenerateEmailService} from "./generate-email.service";
import {RecentCalibration} from "../recent-calibrations/recent-calibrations.component";
import {CalibrationDue} from "../calibrations-due/calibrations-due.component";
import {ShowDialog, ShowError, ShowMessage} from "../utilities/messageBox";
import {SplitByCapitalsPipe} from "../utilities/split-by-capitals.pipe";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";

export interface GenerateReport {
    from: string;
    to: string;
    clients: ClientName[];
}

export interface ClientName {
    id: number;
    name: string;
}

export interface EmailReportData {
    userId: number;
    recipient: string;
    reportType: string;
    from: string;
    to?: string;
}

@Component({
    templateUrl: "app/generate-email/generate-email.component.html",
    providers: [GenerateEmailService, HttpService],
    styleUrls: ["app/generate-email/styles.css"],
    pipes: [SplitByCapitalsPipe],
    directives: [SpinnerComponent, WCButtonComponent]
})
export class GenerateEmailComponent implements OnInit {

    private _isAdministrator: boolean = false;
    private _generateReport: GenerateReport;
    private _clientNames: ClientName[];
    private _selectedClientId: number;
    private _reportType: string = "RecentCalibrations";

    private _recentCalibrations: RecentCalibration[];
    private _calibrationsDue: CalibrationDue[];

    private _isRequesting: boolean = false;
    private _isUpdating: boolean = false;
    private _isSending: boolean = false;

    constructor(private _service: GenerateEmailService) {
        this._isAdministrator = isAdministrator();
    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getGenerateReportData().subscribe((response: Response) => {
            this._generateReport = response.json();
            this._generateReport.from = this.asDate(this._generateReport.from).toISOString().split('T')[0];
            this._generateReport.to = this.asDate(this._generateReport.to).toISOString().split('T')[0];
            this._clientNames = this._generateReport.clients;
            this._selectedClientId = this._clientNames[0].id;
            this.updateReport();
        },
        (error: any) => {
            ShowError("Unable to get email report configuration, please try again later.", error);
            this._isRequesting = false;
        },
        () => {
            this._isRequesting = false;
        });
    }

    clearData() {
        this._recentCalibrations = null;
        this._calibrationsDue = null;
    }

    updateReport(): void {
        if (this._reportType === "RecentCalibrations") {
            this.updateRecentReport();
        }
        else {
            this.updateDueReport();
        }
    }

    updateRecentReport() {
        this._isUpdating = true;

        this._service.getRecentCalibrationsData(this._selectedClientId, this._generateReport.from).subscribe((response: Response) => {
            var data = response.json();
            this._recentCalibrations = data;
        },
        (error: any) => {
            ShowError("Unable to get report data, please try again later.", error);
            this._isUpdating = false;
        },
        () => {
            this._isUpdating = false;
        });
    }

    updateDueReport() {
        this._isUpdating = true;

        this._service.getCalibrationsDueData(this._selectedClientId, this._generateReport.from, this._generateReport.to).subscribe((response: Response) => {
            var data = response.json();
            this._calibrationsDue = data;
        },
        (error: any) => {
            ShowError("Unable to get report data, please try again later.", error);
            this._isUpdating = false;
        },
        () => {
            this._isUpdating = false;
        });
    }

    sendEmail(): void {
        var $this: GenerateEmailComponent = this;
        var emailData = <EmailReportData>{
            userId: this._selectedClientId,
            recipient: "",
            reportType: this._reportType,
            from: this._generateReport.from,
            to: this._generateReport.to
        };

        this.showDialog(function() {
            var email: string = this.find("#email").val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this._isSending = true;
                emailData.recipient = email;

                $this._service.sendEmail(emailData).subscribe((response: Response) => {
                    ShowMessage("Your email has been sent.");
                },
                (error: any)=>{
                    ShowError("Unable to send email, please try again later.", error);
                    $this._isSending = false;
                },
                () => {
                    $this._isSending = false;                    
                });
            }
        });
    }

    asDate(input: string): Date {
        return new Date(input);
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
