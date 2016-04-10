import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {ShowError} from "../utilities/messageBox";

@Injectable()
export class QCCheckService {

    constructor(private _httpService: HttpService) {

    }

    getQCChecks(): Observable<Response> {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/qccheck/`);
    }

    downloadPdf(id: Number, documentType: string): void {

        this._httpService.get(`${AppSettings.API_ENDPOINT}/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                if (window.navigator.msSaveOrOpenBlob) {
                    var blobObject = new Blob([response.text()]);
                    window.navigator.msSaveOrOpenBlob(blobObject, "document.pdf");
                }
                else {
                    window.open("data:application/pdf;base64," + encodeURIComponent(response.text()));
                }
            },
            (error: any) => {
                ShowError("Unable to download PDF, please try again later.", error);
            });
    }

}
