import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { RecentCalibrationsService } from './recent-calibrations.service';
import { IPaginationInstance } from 'ng2-pagination';
import { CsvHelper } from '../utilities/csv.helper';
import { ShowMessage, ShowError, ShowDialog } from '../utilities/messageBox';

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
    templateUrl: './recent-calibrations.component.html',
    styleUrls: ['./styles.scss'],
    providers: [RecentCalibrationsService, HttpService]
})
export class RecentCalibrationsComponent implements OnInit {

    public selectedDepotName: string;
    public vehicleRegistration: string;
    public from: string;
    public to: string;

    public paginationConfig: IPaginationInstance = {
        id: 'recentCalibrations',
        itemsPerPage: 10,
        currentPage: 1
    };

    private recentCalibrations: RecentCalibration[];
    private filteredCalibrations: RecentCalibration[];

    private isRequesting: boolean;
    private isDownloading: boolean = false;
    private isEmailing: boolean = false;
    private depotNames: string[];

    constructor(private service: RecentCalibrationsService, private router: Router) {
        let d = new Date();
        d.setDate(d.getDate() - 28);
        this.from = d.toISOString().split('T')[0];
        this.to = new Date().toISOString().split('T')[0];
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        this.isRequesting = true;
        this.service.getRecent(this.from, this.to, this.selectedDepotName).subscribe((response: Response) => {
            this.recentCalibrations = response.json();
            this.registrationChanged(this.vehicleRegistration);
            this.depotNames = this.getDepotNames();
            this.depotNames.unshift('- All -');
            this.selectedDepotName = '- All -';
            this.isRequesting = false;
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError('Unable to get list of recent calibrations, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    getDepotNames(): string[] {
        if (!this.recentCalibrations) {
            return;
        }
        let depotNames = new Array<string>();
        for (let index = 0; index < this.recentCalibrations.length; index++) {
            let element = this.recentCalibrations[index];
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
            return this.selectedDepotName === '- All -' || item.depotName === this.selectedDepotName;
        })
            .slice((this.paginationConfig.currentPage - 1) * 10, ((this.paginationConfig.currentPage - 1) * 10) + 10);
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

        let $this: RecentCalibrationsComponent = this;
        this.showDialog(function () {
            let email = this.find('#email').val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this.service.emailCertificate(email, selectedCalibration).subscribe();
                ShowMessage('Your email has been sent.');
            }
        });
    }

    downloadGridData(): void {
        this.isDownloading = true;
        let csvHelper = new CsvHelper();
        csvHelper.download(this.getGridData(), this.paginationConfig.currentPage, this.selectGridData);
        this.isDownloading = false;
    }

    emailGridData(): void {
        let $this: RecentCalibrationsComponent = this;
        this.showDialog(function () {
            let email = this.find('#email').val();
            if (email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                $this.isEmailing = true;
                $this.service.emailGridData(email, $this.getGridData()).subscribe();
                ShowMessage('Your email has been sent.');
            }
            $this.isEmailing = false;
        });
    }

    registrationChanged(vehicleRegistration: string): void {
        if (!vehicleRegistration) {
            this.filteredCalibrations = this.recentCalibrations;
            return;
        }

        this.filteredCalibrations = this.recentCalibrations.filter((item: RecentCalibration) => {
            if (!item.registration) {
                return false;
            }
            return item.registration.toLowerCase().indexOf(vehicleRegistration.toLowerCase()) > -1;
        });
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    fromChanged(from: string) {
        this.from = from;
    }

    toChanged(to: string) {
        this.to = to;
    }

    editCustomer(customerName: string) {
        this.router.navigate(['AddressBook', { customerName: customerName }]);
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

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }

    getIconPath(documentIcon: string): string {
        return '/images/' + documentIcon + '.png';
    }
}
