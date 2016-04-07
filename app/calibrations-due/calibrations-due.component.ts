import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {Response, Http} from "angular2/http";
import {hasValidToken} from "../utilities/Jwt";
import {CalibrationsDueService} from "./calibrations-due.service";
import {HttpService} from "../utilities/HttpService";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {DepotNamePipe} from "../recent-calibrations/depot-name.pipe";

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
@CanActivate(() => hasValidToken())
export class CalibrationsDueComponent implements OnInit {

    private _selectedDepotName: string;

    private _calibrationsDue: CalibrationDue[];
    private _depotNames: string[];
    private _isRequesting: boolean;

    constructor(private _service: CalibrationsDueService, private _http: Http) {

    }

    ngOnInit(): void {
        this._isRequesting = true;
        this._service.getCalibrationsDue().subscribe((response: Response) => {
            this._calibrationsDue = response.json();
            this._depotNames = this.getDepotNames();
            this._isRequesting = false;
        });
    }

    downloadCertificate($event: Event, selectedCalibration: CalibrationDue): void {
        if (!selectedCalibration || $event.defaultPrevented) {
            return;
        }

        this._service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
    }

    getDepotNames(): string[] {
        if (!this._calibrationsDue) {
            return;
        }
        var depotNames: Array<string> = new Array<string>();
        for (var index: number = 0; index < this._calibrationsDue.length; index++) {
            var element: CalibrationDue = this._calibrationsDue[index];
            if (depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
