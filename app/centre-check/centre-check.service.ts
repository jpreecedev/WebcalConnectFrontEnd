import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {ShowError, ShowMessage} from "../utilities/messageBox";

@Injectable()
export class CentreCheckService {

    constructor(private httpService: HttpService) {

    }

    getCentreChecks(): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/centrecheck/`);
    }

    downloadPdf(id: Number, documentType: string): void {

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
                ShowError("Unable to download PDF, please try again later.", error);
            });
    }

}
