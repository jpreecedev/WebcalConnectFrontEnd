import {Component, Directive, NgZone, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {HttpService} from "../utilities/HttpService";
import {DirectUploadService} from "./direct-upload.service";
import {SpinnerComponent} from "../utilities/spinner/spinner.component";
import {WCButtonComponent} from "../utilities/wc-button/wc-button.component";
import {PaginatePipe, PaginationService, PaginationControlsCmp} from "ng2-pagination";
import {ShowMessage, ShowError} from "../utilities/messageBox";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../app.settings";
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

export interface DirectUploadDocument {
    documentId: number;
    fileName: string;
    uploaded: string;
}

@Component({
    templateUrl: "app/direct-upload/direct-upload.component.html",
    styleUrls: ["app/direct-upload/styles.css"],
    providers: [DirectUploadService, HttpService, PaginationService],
    pipes: [PaginatePipe],
    directives: [SpinnerComponent, PaginationControlsCmp, WCButtonComponent]
})
export class DirectUploadComponent implements OnInit {

    private zone: NgZone;
    private options: Object = {
        url: AppSettings.API_ENDPOINT + "resource/directupload"
    };
    private multipleProgress: number = 0;
    private multipleResp: any[] = [];

    private uploadedCertificates: DirectUploadDocument[];

    private isRequesting: boolean;
    private isUploading: boolean = false;

    private page: number = 1;

    constructor(private service: DirectUploadService) {
        this.zone = new NgZone({ enableLongStackTrace: false });
    }

    handleMultipleUpload(data: any): void {
        let index = this.multipleResp.findIndex(x => x.id === data.id);
        if (index === -1) {
            this.multipleResp.push(data);
        }
        else {
            this.zone.run(() => {
                this.multipleResp[index] = data;
            });
        }

        let total = 0, uploaded = 0;
        this.multipleResp.forEach(resp => {
            total += resp.progress.total;
            uploaded += resp.progress.loaded;
        });

        this.multipleProgress = Math.floor(uploaded / (total / 100));
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        this.isRequesting = true;
        this.service.getDirectUploadDocuments().subscribe((response: Response) => {
            this.uploadedCertificates = response.json();
            this.isRequesting = false;
        },
            (error: any) => {
                this.isRequesting = false;
                ShowError("Unable to get list of direct upload certificates, please try again later.", error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    downloadCertificate(selectedDocument: DirectUploadDocument): void {
        if (!selectedDocument) {
            return;
        }

        this.service.downloadCertificate(selectedDocument.documentId);
    }

    asDate(input: string): Date {
        return new Date(input);
    }
}
