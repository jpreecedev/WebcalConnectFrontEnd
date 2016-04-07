import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {AppSettings} from "../app.settings";

@Injectable()
export class InspectionDataService {

    constructor(private _httpService: HttpService) {

    }

    getVehicleInspectionData<T>(vehicleRegistration: string): Observable<T> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/inspectiondata/${vehicleRegistration}`)
            .map((res: Response) => {
                return res.json();
            });
    }
}
