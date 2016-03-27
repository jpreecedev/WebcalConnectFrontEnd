import { Component, OnInit } from "angular2/core";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";
import { HttpService } from "../utilities/HttpService";
import { RecentCalibrationsService } from "./recent-calibrations.service";
import { DepotNamePipe } from "./depot-name.pipe";

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
    pipes: [DepotNamePipe]
})
@CanActivate(() => hasValidToken())
export class RecentCalibrationsComponent implements OnInit {

    private _recentCalibrations: RecentCalibration[];
    private _depotNames: string[];
    private _selectedDepotName: string;

    constructor(private _service: RecentCalibrationsService) {

    }

    ngOnInit() {

        this._service.getRecent().then((response: RecentCalibration[]) => {
            this._recentCalibrations = response;
            this._depotNames = this.getDepotNames();
        });

    }

    getDepotNames() {
        if (!this._recentCalibrations || this._recentCalibrations.length === 0) {
            return;
        }
        var depotNames = new Array<string>();
        for (var index = 0; index < this._recentCalibrations.length; index++) {
            var element = this._recentCalibrations[index];
            if (depotNames.indexOf(element.depotName) === -1) {
                depotNames.push(element.depotName);
            }
        }
        return depotNames;
    }

    downloadCertificate(selectedCalibration: RecentCalibration) {
        if (!selectedCalibration) {
            return;
        }

        this._service.downloadCertificate(selectedCalibration.documentId, selectedCalibration.documentTypeEnum);
    }

    asDate(input: string) {
        return new Date(input);
    }
}
