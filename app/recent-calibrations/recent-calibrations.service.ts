import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {RecentCalibration} from "./recent-calibrations.component";
import {AppSettings} from "../app.settings";
import {ShowError} from "../utilities/messageBox";

@Injectable()
export class RecentCalibrationsService {

    constructor(private _httpService: HttpService) {

    }

    getRecent(): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/recentcalibrations/`);
    }

    downloadCertificate(id: Number, documentType: string): void {

        this._httpService.get(`${AppSettings.API_ENDPOINT}/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                window.open("data:application/pdf;base64," + response.text());
            },
            (error: any) => {
                ShowError("Unable to download certificate, please try again later.", error);
            });
    }

    emailCertificate(recipient: string, calibration: RecentCalibration): Observable<Response> {

        return this._httpService.post(`${AppSettings.API_ENDPOINT}/recentcalibrations/emailcertificate/`, JSON.stringify({
            recipient: recipient,
            documentId: calibration.documentId,
            documentType: calibration.documentTypeEnum
        }));

    }

    emailGridData(recipient: string, calibrations: RecentCalibration[]): Observable<Response> {

        return this._httpService.post(`${AppSettings.API_ENDPOINT}/recentcalibrations/email/`, JSON.stringify({
            recipient: recipient,
            calibrations: calibrations
        }));

    }

}
