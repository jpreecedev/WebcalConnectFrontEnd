import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class InspectionDataService {

    constructor(private _httpService: HttpService) {

    }

    getVehicleInspectionData<T>(vehicleRegistration: string): Observable<T> {
        return this._httpService.get("http://localhost:50139/api/inspectiondata/" + vehicleRegistration)
            .map((res: Response) => {
                return res.json();
            });
    }
}