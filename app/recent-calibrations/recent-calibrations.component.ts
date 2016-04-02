import { Component, OnInit } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";
import { HttpService } from "../utilities/HttpService";
import { RecentCalibrationsService } from "./recent-calibrations.service";
import { DepotNamePipe } from "./depot-name.pipe";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";

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
    providers: [RecentCalibrationsService, HttpService],
    pipes: [DepotNamePipe],
    directives: [SpinnerComponent]
})
@CanActivate(() => hasValidToken())
export class RecentCalibrationsComponent implements OnInit {

    public selectedDepotName: string = "-- All --";
    
    private _recentCalibrations: RecentCalibration[];
    private _depotNames: string[];
    private _isRequesting: boolean;

    constructor(private _service: RecentCalibrationsService) {

    }

    ngOnInit(): void {

        this._isRequesting = true;
        this._service.getRecent().subscribe((response: RecentCalibration[]) => {
            this._recentCalibrations = response;
            this._depotNames = this.getDepotNames();
            this._isRequesting = false;
        });

    }

    getDepotNames(): string[] {
        if (!this._recentCalibrations || this._recentCalibrations.length === 0) {
            return;
        }
        var depotNames: Array<string> = new Array<string>();
        depotNames.push("-- All --");
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
