import { Component, OnInit } from "@angular/core";
import { Response, Http } from "@angular/http";
import { DetailedExceptionsService } from "./detailed-exceptions.service";
import { HttpService } from "../utilities/HttpService";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { PaginatePipe, PaginationService, PaginationControlsCmp } from "ng2-pagination";
import { ShowError, ShowMessage } from "../utilities/messageBox";
import { WCButtonComponent } from "../utilities/wc-button/wc-button.component";

export interface DetailedException {
    id: number;
    message: string;
    date: string;
    company: string;
}

@Component({
    templateUrl: "app/detailed-exceptions/detailed-exceptions.component.html",
    styleUrls: ["app/detailed-exceptions/styles.css"],
    providers: [DetailedExceptionsService, HttpService, PaginationService],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent],
    pipes: [PaginatePipe]
})
export class DetailedExceptionsComponent implements OnInit {

    private isRequesting: boolean;
    private isDeleting: boolean;

    detailedExceptions: DetailedException[];

    constructor(private service: DetailedExceptionsService) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getDetailedExceptions().subscribe((response: Response) => {
            this.detailedExceptions = response.json();
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError("Unable to get list of detailed exceptions, please try again later.", error);
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
            var index = this.detailedExceptions.indexOf(selectedDetailedException);
            if (index > -1) {
                this.detailedExceptions.splice(index, 1);
            }
        },
            (error: any) => {
                ShowError("Unable to delete detailed exception, please try again later.", error);
                this.isDeleting = false;
            },
            () => {
                this.isDeleting = false;
            });
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
