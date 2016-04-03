import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import {CentreCheck} from "./centre-check.component";

@Injectable()
export class CentreCheckService {

    constructor(private _httpService: HttpService) {

    }

    getCentreChecks(): Observable<Response> {
        return this._httpService.get("http://localhost:50139/api/centrecheck/");
    }

    downloadPdf(id: Number, documentType: string): void {

        this._httpService.get(`http://localhost:50139/api/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                window.open("data:application/pdf;base64," + response.text());
            });
    }

}
