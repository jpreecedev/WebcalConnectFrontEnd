import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";

@Injectable()
export class GenerateEmailService {

    constructor(private _httpService: HttpService) {
    }

    getGenerateReportData(): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/generateemailreport/`);
    }

    getRecentCalibrationsData(userId: number, from: string): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/recentcalibrations/${userId}/${from}`);
    }

    getCalibrationsDueData(userId: number, from: string, to: string): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/calibrationsDue/${userId}/${from}/${to}`);
    }

}
