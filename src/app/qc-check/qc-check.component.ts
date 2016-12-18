import { Component, OnInit } from '@angular/core';
import { Response, Http } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { QCCheckService } from './qc-check.service';
import { ShowError } from '../utilities/messageBox';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

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
    templateUrl: './qc-check.component.html',
    styleUrls: ['./styles.scss'],
    providers: [QCCheckService, HttpService]
})
export class QCCheckComponent implements OnInit {

    public selectedDepotName: string;

    public paginationConfig = {
        id: 'qcCheck',
        itemsPerPage: 10,
        currentPage: 1
    };

    private qcChecks: QCCheck[];
    private isRequesting: boolean;

    constructor(private service: QCCheckService, private http: Http) {

    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getQCChecks().subscribe((response: Response) => {
            this.qcChecks = response.json();
        },
        (error: any) => {
            ShowError('Unable to get a list of QC checks, please try again later.', error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    downloadPdf($event: Event, selectedQCCheck: QCCheck): void {
        if (!selectedQCCheck || $event.defaultPrevented) {
            return;
        }

        this.service.downloadPdf(selectedQCCheck.documentId, selectedQCCheck.documentTypeEnum);
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
