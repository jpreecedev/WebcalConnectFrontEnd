import {Component, OnInit} from "angular2/core";
import {CanActivate} from "angular2/router";
import {Response, Http} from "angular2/http";
import {hasValidToken} from "../utilities/Jwt";
import {HttpService} from "../utilities/HttpService";
import {RecentCalibrationsService} from "./recent-calibrations.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp, IPaginationInstance} from "ng2-pagination";
import {Observable} from "rxjs/Rx";
import {DepotNamePipe} from "./depot-name.pipe";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

export interface RecentCalibration {
    companyName: string;
    documentType: string;
    documentIcon: string;
    expiration: Date;
    registration: string;
    technician: string;
    customer: string;
    depotName: string;
    documentId: number;
    documentTypeEnum: string;
}

@Component({
    templateUrl: "app/recent-calibrations/recent-calibrations.component.html",
    styleUrls: ["app/recent-calibrations/styles.css"],
    providers: [RecentCalibrationsService, HttpService, PaginationService],
    pipes: [PaginatePipe, DepotNamePipe],
    directives: [SpinnerComponent, PaginationControlsCmp]
})
@CanActivate(() => hasValidToken())
export class RecentCalibrationsComponent implements OnInit {

    public selectedDepotName: string;

    private _recentCalibrations: RecentCalibration[];
    private _depotNames: string[];
    private _isRequesting: boolean;
    
    constructor(private _service: RecentCalibrationsService, private _http: Http) {

    }

    ngOnInit(): void {
        this.getPage(1);
    }

    getPage(page: number) {
        this._isRequesting = true;
        this._service.getRecent().subscribe((response: Response)=>{
            this._recentCalibrations = response.json();
            this._depotNames = this.getDepotNames();
            this._isRequesting = false;
        });
    }

    getDepotNames(): string[] {
        if (!this._recentCalibrations) {
            return;
        }
        var depotNames: Array<string> = new Array<string>();
        for (var index: number = 0; index < this._recentCalibrations.length; index++) {
            var element: RecentCalibration = this._recentCalibrations[index];
            if (depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    downloadCertificate(selectedCalibration: RecentCalibration): void {
        if (!selectedCalibration) {
            return;
        }

        this._service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
