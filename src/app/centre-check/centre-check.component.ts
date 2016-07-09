import { Component, OnInit } from "@angular/core";
import { Response, Http } from "@angular/http";
import { HttpService } from "../utilities/HttpService";
import { CentreCheckService } from "./centre-check.service";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { TickPipe } from "../utilities/tick.pipe";
import { ShowError } from "../utilities/messageBox";
import { PaginatePipe, PaginationControlsCmp, IPaginationInstance } from "ng2-pagination";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

export interface CentreCheck {
    centreName: string;
    sealNumber: string;
    date: string;
    name: string;
    documentId: number;
    documentTypeEnum: string;
}

@Component({
    templateUrl: "./centre-check.component.html",
    styleUrls: ["./styles.css"],
    providers: [CentreCheckService, HttpService],
    pipes: [PaginatePipe, TickPipe],
    directives: [SpinnerComponent, PaginationControlsCmp]
})
export class CentreCheckComponent implements OnInit {

    public paginationConfig: IPaginationInstance = {
        id: "centreCheck",
        itemsPerPage: 10,
        currentPage: 1
    };

    private centreChecks: CentreCheck[];
    private isRequesting: boolean;

    constructor(private service: CentreCheckService, private http: Http) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getCentreChecks().subscribe((response: Response) => {
            this.centreChecks = response.json();
        },
        (error: any) => {
            ShowError("Unable to get list of centre checks, please try again later.", error);
            this.isRequesting = false;
        },
        () => {
            this.isRequesting = false;
        });
    }

    downloadPdf($event: Event, selectedCentreCheck: CentreCheck): void {
        if (!selectedCentreCheck || $event.defaultPrevented) {
            return;
        }

        this.service.downloadPdf(selectedCentreCheck.documentId, selectedCentreCheck.documentTypeEnum);
    }

    asDate(input: string): Date {
        return new Date(input);
    }

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
