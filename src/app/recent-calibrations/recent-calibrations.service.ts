import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import { RecentCalibration } from './recent-calibrations.component';
import { AppSettings } from '../app.settings';
import { ShowError, ShowMessage } from '../utilities/messageBox';

@Injectable()
export class RecentCalibrationsService {

    constructor(private httpService: HttpService) {

    }

    b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    getRecent(from: string, to: string, filter: string): Observable<Response> {
        if (filter === '- All -') {
            filter = null;
        }

        return this.httpService.get(`${AppSettings.API_ENDPOINT}/recentcalibrations/${from}/${to}/${filter ? filter : ''}`);
    }

    downloadCertificate(id: Number, documentType: string): void {

        this.httpService.get(`${AppSettings.API_ENDPOINT}/resource/certificate/${id}/${documentType}`)
            .subscribe((response: Response) => {
                let contentType = 'application/pdf';
                let b64Data = response.text();
                let blob = this.b64toBlob(b64Data, contentType);
                let blobUrl = URL.createObjectURL(blob);

                let link = document.createElement("a");
                link.download = "certificate";
                link.href = blobUrl;
                document.body.appendChild(link);
                link.click();
            },
            (error: any) => {
                ShowError('Unable to download certificate, please try again later.', error);
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
