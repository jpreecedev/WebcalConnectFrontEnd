import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {EmailReportData} from "./generate-email.component";

@Injectable()
export class GenerateEmailService {

    constructor(private httpService: HttpService) {
    }

    getGenerateReportData(): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/generateemailreport/`);
    }

    getRecentCalibrationsData(userId: number, from: string): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/recentcalibrations/${userId}/${from}`);
    }

    getCalibrationsDueData(userId: number, from: string, to: string): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/calibrationsDue/${userId}/${from}/${to}`);
    }
    
    sendEmail(data: EmailReportData): Observable<Response>{
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/generateemailreport`, JSON.stringify(data));        
    }

}
