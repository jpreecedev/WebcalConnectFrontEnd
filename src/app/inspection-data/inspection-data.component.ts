import { Component } from '@angular/core';
import { HttpService } from '../utilities/http.service';
import { InspectionDataService } from './inspection-data.service';
import { ShowError } from '../utilities/messageBox';

export interface InspectionData {
    calibrationDate: string;
    inspectionDate: string;
    vehicleMake: string;
    vehicleModel: string;
    tachoModel: string;
    inspectionData: string;
    history: History[];
    isDefault: boolean;
}

export interface History {
    calibrationDate: string;
    inspectionInfo: string;
}

@Component({
    templateUrl: './inspection-data.component.html',
    styleUrls: ['./styles.scss'],
    providers: [InspectionDataService, HttpService]
})
export class InspectionDataComponent {

    public isRequesting = false;
    public vehicleRegistration: string;
    public inspectionData: InspectionData;

    constructor(private service: InspectionDataService) {
    }

    submit(): void {
        if (!this.vehicleRegistration) {
            return;
        }

        this.inspectionData = undefined;
        this.isRequesting = true;
        this.service.getVehicleInspectionData<InspectionData>(this.vehicleRegistration).subscribe((data: InspectionData) => {
            this.inspectionData = data;
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError('Unable to get vehicle inspection data, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    reset(): void {
        this.inspectionData = undefined;
        this.isRequesting = false;
        this.vehicleRegistration = '';
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
