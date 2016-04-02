import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {RecentCalibration} from "./recent-calibrations.component";

@Injectable()
export class RecentCalibrationsService {

    constructor(private _httpService: HttpService) {

    }

    getRecent(): Observable<RecentCalibration[]> {
        return this._httpService.get("http://localhost:50139/api/recentcalibrations")
            .map((response: Response) => {
                return response.json();
            });
    }

    downloadCertificate(id: Number, documentType: string): void {

        this._httpService.get(`http://localhost:50139/api/resource/certificate/${id}/${documentType}`)
            .map((response: Response) => {
                window.open("data:application/pdf;base64," + response.text());
            });
    }

}
