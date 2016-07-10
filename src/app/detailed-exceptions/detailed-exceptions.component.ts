import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { DetailedExceptionsService } from './detailed-exceptions.service';
import { HttpService } from '../utilities/http.service';
import { SpinnerComponent } from '../utilities/spinner/spinner.component';
import { PaginatePipe, PaginationControlsCmp, IPaginationInstance } from 'ng2-pagination';
import { ShowError, ShowMessage } from '../utilities/messageBox';
import { WCButtonComponent } from '../utilities/wc-button/wc-button.component';

export interface DetailedException {
    id: number;
    message: string;
    date: string;
    company: string;
}

@Component({
    templateUrl: './detailed-exceptions.component.html',
    styleUrls: ['./styles.scss'],
    providers: [DetailedExceptionsService, HttpService],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent],
    pipes: [PaginatePipe]
})
export class DetailedExceptionsComponent implements OnInit {

    public paginationConfig: IPaginationInstance = {
        id: 'detailedExceptions',
        itemsPerPage: 10,
        currentPage: 1
    };

    public detailedExceptions: DetailedException[];

    private isRequesting: boolean;
    private isDeleting: boolean;

    constructor(private service: DetailedExceptionsService) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getDetailedExceptions().subscribe((response: Response) => {
            this.detailedExceptions = response.json();
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError('Unable to get list of detailed exceptions, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    showRawImage($event: Event, selectedDetailedException: DetailedException): void {
        if (!selectedDetailedException || $event.defaultPrevented) {
            return;
        }

        this.service.showRawImage(selectedDetailedException.id);
    }

    showExceptionMessage(selectedDetailedException: DetailedException): void {
        if (selectedDetailedException) {
            ShowMessage(selectedDetailedException.message);
        }
    }

    deleteDetailedException($event: Event, selectedDetailedException: DetailedException): void {
        if (!selectedDetailedException || $event.defaultPrevented) {
            return;
        }

        this.isDeleting = true;

        this.service.deleteDetailedException(selectedDetailedException.id).subscribe((response: Response) => {
            let index = this.detailedExceptions.indexOf(selectedDetailedException);
            if (index > -1) {
                this.detailedExceptions.splice(index, 1);
            }
        },
            (error: any) => {
                ShowError('Unable to delete detailed exception, please try again later.', error);
                this.isDeleting = false;
            },
            () => {
                this.isDeleting = false;
            });
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
