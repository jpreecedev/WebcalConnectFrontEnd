import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {RecentCalibration} from "./recent-calibrations.component";

@Injectable()
export class RecentCalibrationsService {

    constructor(private _httpService: HttpService) {

    }

    getRecent(): Observable<Response> {
        return this._httpService.get("http://localhost:50139/api/recentcalibrations/");
    }

    downloadCertificate(id: Number, documentType: string): void {

        this._httpService.get(`http://localhost:50139/api/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                window.open("data:application/pdf;base64," + response.text());
            });
    }

    emailCertificate(recipient: string, calibration: RecentCalibration): Observable<Response> {

        return this._httpService.post("http://localhost:50139/api/recentcalibrations/emailcertificate/", JSON.stringify({
            recipient: recipient,
            documentId: calibration.documentId,
            documentType: calibration.documentTypeEnum
        }));

    }

    emailGridData(recipient: string, calibrations: RecentCalibration[]): Observable<Response> {

        return this._httpService.post("http://localhost:50139/api/recentcalibrations/email/", JSON.stringify({
            recipient: recipient,
            calibrations: calibrations
        }));

    }

}
