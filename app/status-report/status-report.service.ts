import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {StatusReport} from "./status-report.component";

@Injectable()
export class StatusReportService {

    constructor(private httpService: HttpService) {

    }

    getStatusReport(): Observable<StatusReport> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/statusreport/27`)
            .map((response: Response) => {
                return response.json();
            });
    }

}
