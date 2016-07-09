import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { FileUploadService} from '../utilities/file-upload.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app.settings';
import { StatusReport } from './status-report.component';

@Injectable()
export class StatusReportService {

    constructor(private httpService: HttpService, private fileUploadService: FileUploadService) {

    }

    getStatusReport(userId?: number): Observable<StatusReport> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/statusreport/${userId ? userId : 'null'}`)
            .map((response: Response) => {
                return response.json();
            });
    }

    sendStatusReportData(userId: number, images: File[], callback: Function): void {
        this.fileUploadService.upload(`${AppSettings.API_ENDPOINT}/statusreport/${userId}`, images).then(() => {
            callback();
        })
        .catch(() => {
            callback();
        });
    }
}
