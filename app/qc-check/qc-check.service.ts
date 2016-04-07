import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";

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
                window.open("data:application/pdf;base64," + response.text());
            });
    }

}
