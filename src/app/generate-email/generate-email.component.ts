import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { GenerateEmailService } from './generate-email.service';
import { RecentCalibration } from '../recent-calibrations/recent-calibrations.component';
import { CalibrationDue } from '../calibrations-due/calibrations-due.component';
import { ShowDialog, ShowError, ShowMessage } from '../utilities/messageBox';
import { isAdministrator } from '../utilities/Jwt';
import { HttpService } from '../utilities/http.service';

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
    templateUrl: './generate-email.component.html',
    providers: [GenerateEmailService, HttpService],
    styleUrls: ['./styles.scss']
})
export class GenerateEmailComponent implements OnInit {

    private isAdministrator = false;
    private generateReport: GenerateReport;
    private clientNames: ClientName[];
    private selectedClientId: number;
    private reportType = 'RecentCalibrations';

    private recentCalibrations: RecentCalibration[];
    private calibrationsDue: CalibrationDue[];

    private isRequesting = false;
    private isUpdating = false;
    private isSending = false;

    constructor(private service: GenerateEmailService) {
        this.isAdministrator = isAdministrator();
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getGenerateReportData().subscribe((response: Response) => {
            this.generateReport = response.json();
            this.generateReport.from = this.asDate(this.generateReport.from).toISOString().split('T')[0];
            this.generateReport.to = this.asDate(this.generateReport.to).toISOString().split('T')[0];
            this.clientNames = this.generateReport.clients;
            this.selectedClientId = this.clientNames[0].id;
            this.updateReport();
        },
            (error: any) => {
                ShowError('Unable to get email report configuration, please try again later.', error);
                this.isRequesting = false;
            },
            () => {
                this.isRequesting = false;
            });
    }

    clearData() {
        this.recentCalibrations = null;
        this.calibrationsDue = null;
    }

    updateReport(): void {
        if (this.reportType === 'RecentCalibrations') {
            this.updateRecentReport();
        } else {
            this.updateDueReport();
        }
    }

    updateRecentReport() {
        this.isUpdating = true;

        this.service.getRecentCalibrationsData(this.selectedClientId, this.generateReport.from).subscribe((response: Response) => {
            let data = response.json();
            this.recentCalibrations = data;
        },
            (error: any) => {
                ShowError('Unable to get report data, please try again later.', error);
                this.isUpdating = false;
            },
            () => {
                this.isUpdating = false;
            });
    }

    updateDueReport() {
        this.isUpdating = true;

        this.service.getCalibrationsDueData(this.selectedClientId, this.generateReport.from, this.generateReport.to).subscribe((response: Response) => {
            let data = response.json();
            this.calibrationsDue = data;
        },
            (error: any) => {
                ShowError('Unable to get report data, please try again later.', error);
                this.isUpdating = false;
            },
            () => {
                this.isUpdating = false;
            });
    }

    sendEmail(): void {
        let $this: GenerateEmailComponent = this;
        let emailData = <EmailReportData>{
            userId: this.selectedClientId,
            recipient: '',
            reportType: this.reportType,
            from: this.generateReport.from,
            to: this.generateReport.to
        };

        this.showDialog(function () {
            let email: string = this.find('#email').val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this.isSending = true;
                emailData.recipient = email;

                $this.service.sendEmail(emailData).subscribe((response: Response) => {
                    ShowMessage('Your email has been sent.');
                },
                    (error: any) => {
                        ShowError('Unable to send email, please try again later.', error);
                        $this.isSending = false;
                    },
                    () => {
                        $this.isSending = false;
                    });
            }
        });
    }

    fromChanged(from: string) {
        this.generateReport.from = from;
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    getIconPath(documentIcon: string): string {
        return '/images/' + documentIcon + '.png';
    }

    private showDialog(callback: Function): void {
        ShowDialog({
            title: 'Enter the email address of the recipient',
            message: '<div class=\'row\'>  ' +
            '<div class=\'col-md-12\'> ' +
            '<form class=\'form-horizontal\'> ' +
            '<input id=\'email\' name=\'email\' type=\'email\' placeholder=\'you@yourcompany.com\' class=\'form-control\' required> ' +
            '</form> </div> </div>',
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: callback
                },
                success: {
                    label: 'Send Email',
                    className: 'btn-primary',
                    callback: callback
                }
            }
        });
    }
}
