import { Component, OnInit } from "angular2/core";
import { HttpService } from "../utilities/HttpService";
import { CanActivate } from "angular2/router";
import { hasValidToken } from "../utilities/Jwt";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { InspectionDataService } from "./inspection-data.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';

export interface InspectionData {
    calibrationDate: string;
    inspectionDate: string;
    vehicleMake: string;
    vehicleModel: string;
    tachoModel: string;
    inspectionData: string;
    history: History[];
}

export interface History {
    calibrationDate: string;
    inspectionInfo: string;
}

@Component({
    templateUrl: "app/inspection-data/inspection-data.component.html",
    styleUrls: ["app/inspection-data/styles.css"],
    directives: [SpinnerComponent],
    providers: [InspectionDataService, HttpService]
})
@CanActivate(() => hasValidToken())
export class InspectionDataComponent {

    private _isRequesting: boolean = false;
    private _vehicleRegistration: string;

    private _inspectionData: InspectionData;

    constructor(private _service: InspectionDataService) {
    }

    submit() {
        this._inspectionData = null;
        this._isRequesting = true;
        this._service.getVehicleInspectionData<InspectionData>(this._vehicleRegistration).subscribe((data: InspectionData) => {
            this._inspectionData = data;
            this._isRequesting = false;
        });
    }

    asDate(input: string) {
        return new Date(input);
    }
}
