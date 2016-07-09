import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app.settings';
import { ShowError, ShowMessage } from '../utilities/messageBox';

@Injectable()
export class QCCheckService {

    constructor(private httpService: HttpService) {

    }

    getQCChecks(): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/qccheck/`);
    }

    downloadPdf(id: Number, documentType: string): void {

        this.httpService.get(`${AppSettings.API_ENDPOINT}/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                if (window.navigator.msSaveOrOpenBlob) {
                    let blobObject = new Blob([response.text()]);
                    window.navigator.msSaveOrOpenBlob(blobObject, 'document.pdf');
                } else {
                    let popup = window.open('data:application/pdf;base64,' + encodeURIComponent(response.text()));
                    setTimeout(function () {
                        if (!popup || popup.outerHeight === 0) {
                            ShowMessage('Your web browser might be blocking popups from opening on this page, please add this site to your exception list.');
                        }
                    }, 25);
                }
            },
            (error: any) => {
                ShowError('Unable to download PDF, please try again later.', error);
            });
    }

}
