import { Component, OnInit } from "@angular/core";
import { Response, Http } from "@angular/http";
import { CalibrationsDueService } from "./calibrations-due.service";
import { HttpService } from "../utilities/HttpService";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { PaginatePipe, PaginationService, PaginationControlsCmp } from "ng2-pagination";
import { DepotNamePipe } from "./depot-name.pipe";
import { ShowError } from "../utilities/messageBox";

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
    templateUrl: "app/calibrations-due/calibrations-due.component.html",
    styleUrls: ["app/calibrations-due/styles.css"],
    providers: [CalibrationsDueService, HttpService, PaginationService],
    directives: [SpinnerComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, DepotNamePipe]
})
export class CalibrationsDueComponent implements OnInit {

    private selectedDepotName: string;
    private depotNames: string[];
    private isRequesting: boolean;

    calibrationsDue: CalibrationDue[];

    constructor(private service: CalibrationsDueService, private http: Http) {
    }

    ngOnInit(): void {
        this.isRequesting = true;
        this.service.getCalibrationsDue().subscribe((response: Response) => {
            this.calibrationsDue = response.json();
            this.depotNames = this.getDepotNames();
            this.depotNames.unshift("- All -");
            this.selectedDepotName = "- All -";
        },
        (error: any) => {
            this.isRequesting = false;
            ShowError("Unable to get list of calibrations due, please try again later.", error);
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
        var depotNames: Array<string> = new Array<string>();
        for (var index: number = 0; index < this.calibrationsDue.length; index++) {
            var element: CalibrationDue = this.calibrationsDue[index];
            if (element.depotName && depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
