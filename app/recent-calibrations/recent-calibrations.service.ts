import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { HttpService } from "../utilities/HttpService";
import { Observable } from "rxjs/Observable";
import { RecentCalibration } from "./recent-calibrations.component";
import { AppSettings } from "../app.settings";
import { ShowError, ShowMessage } from "../utilities/messageBox";

@Injectable()
export class RecentCalibrationsService {

    constructor(private httpService: HttpService) {

    }

    getRecent(from: string, to: string, filter: string): Observable<Response> {
        if (filter === "- All -") {
            filter = null;
        }

        return this.httpService.get(`${AppSettings.API_ENDPOINT}/recentcalibrations/${from}/${to}/${filter ? filter : ""}`);
    }

    downloadCertificate(id: Number, documentType: string): void {

        this.httpService.get(`${AppSettings.API_ENDPOINT}/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                if (window.navigator.msSaveOrOpenBlob) {
                    var blobObject = new Blob([response.text()]);
                    window.navigator.msSaveOrOpenBlob(blobObject, "document.pdf");
                }
                else {
                    var popup = window.open("data:application/pdf;base64," + encodeURIComponent(response.text()));
                    setTimeout(function () {
                        if (!popup || popup.outerHeight === 0) {
                            ShowMessage("Your web browser might be blocking popups from opening on this page, please add this site to your exception list.");
                        }
                    }, 25);
                }
            },
            (error: any) => {
                ShowError("Unable to download certificate, please try again later.", error);
            });
    }

    emailCertificate(recipient: string, calibration: RecentCalibration): Observable<Response> {

        return this.httpService.post(`${AppSettings.API_ENDPOINT}/recentcalibrations/emailcertificate/`, JSON.stringify({
            recipient: recipient,
            documentId: calibration.documentId,
            documentType: calibration.documentTypeEnum
        }));

    }

    emailGridData(recipient: string, calibrations: RecentCalibration[]): Observable<Response> {

        return this.httpService.post(`${AppSettings.API_ENDPOINT}/recentcalibrations/email/`, JSON.stringify({
            recipient: recipient,
            calibrations: calibrations
        }));

    }

}
