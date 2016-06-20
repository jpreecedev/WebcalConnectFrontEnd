import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { HttpService } from "../utilities/HttpService";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../app.settings";
import { ShowError, ShowMessage } from "../utilities/messageBox";

@Injectable()
export class DetailedExceptionsService {

    constructor(private httpService: HttpService) {

    }

    getDetailedExceptions(): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/detailedexceptions/`);
    }
    
    deleteDetailedException(id: number): Observable<Response>{
        return this.httpService.delete(`${AppSettings.API_ENDPOINT}/detailedexceptions`, JSON.stringify({id: id}));
    }

    showRawImage(id: Number): void {

        this.httpService.get(`${AppSettings.API_ENDPOINT}/resource/exceptionImage/${id}`)
            .subscribe((response: Response) => {
                if (window.navigator.msSaveOrOpenBlob) {
                    var blobObject = new Blob([response.text()]);
                    window.navigator.msSaveOrOpenBlob(blobObject, "ExceptionScreenshop.jpg");
                }
                else {
                    var popup = window.open("data:image/jpeg;base64," + encodeURIComponent(response.text()));
                    setTimeout(function () {
                        if (!popup || popup.outerHeight === 0) {
                            ShowMessage("Your web browser might be blocking popups from opening on this page, please add this site to your exception list.");
                        }
                    }, 25);
                }
            },
            (error: any) => {
                ShowError("Unable to download exception image, please try again later.", error);
            });
    }
}
