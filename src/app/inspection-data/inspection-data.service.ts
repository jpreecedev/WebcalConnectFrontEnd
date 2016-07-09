import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppSettings } from '../app.settings';

@Injectable()
export class InspectionDataService {

    constructor(private httpService: HttpService) {

    }

    getVehicleInspectionData<T>(vehicleRegistration: string): Observable<T> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/inspectiondata/${vehicleRegistration}`)
            .map((res: Response) => {
                return res.json();
            });
    }
}
