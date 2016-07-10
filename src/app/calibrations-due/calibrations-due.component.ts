import { Component, OnInit } from '@angular/core';
import { Response, Http } from '@angular/http';
import { CalibrationsDueService } from './calibrations-due.service';
import { HttpService } from '../utilities/http.service';
import { SpinnerComponent } from '../utilities/spinner/spinner.component';
import { PaginatePipe, PaginationControlsCmp, IPaginationInstance } from 'ng2-pagination';
import { DepotNamePipe } from './depot-name.pipe';
import { ShowError } from '../utilities/messageBox';

export interface CalibrationDue {
    date: string;
    expiration: string;
    registration: string;
    technician: string;
    customer: string;
    vehicleManufacturer: string;
    documentId: number;
    documentTypeEnum: string;
    documentType: string;
    documentIcon: string;
    depotName: string;
}

@Component({
    templateUrl: './calibrations-due.component.html',
    styleUrls: ['./styles.scss'],
    providers: [CalibrationsDueService, HttpService],
    directives: [SpinnerComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, DepotNamePipe]
})
export class CalibrationsDueComponent implements OnInit {

    public calibrationsDue: CalibrationDue[];

    public paginationConfig: IPaginationInstance = {
        id: 'calibrationsDue',
        itemsPerPage: 10,
        currentPage: 1
    };

    private selectedDepotName: string;
    private depotNames: string[];
    private isRequesting: boolean;

    constructor(private service: CalibrationsDueService, private http: Http) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getCalibrationsDue().subscribe((response: Response) => {
            this.calibrationsDue = response.json();
            this.depotNames = this.getDepotNames();
            this.depotNames.unshift('- All -');
            this.selectedDepotName = '- All -';
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError('Unable to get list of calibrations due, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    downloadCertificate($event: Event, selectedCalibration: CalibrationDue): void {
        if (!selectedCalibration || $event.defaultPrevented) {
            return;
        }

        this.service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
    }

    getDepotNames(): string[] {
        if (!this.calibrationsDue) {
            return;
        }
        let depotNames = new Array<string>();
        for (let index = 0; index < this.calibrationsDue.length; index++) {
            let element = this.calibrationsDue[index];
            if (element.depotName && depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
