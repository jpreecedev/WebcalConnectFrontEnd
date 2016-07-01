import { Component, Directive, NgZone, OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { HttpService } from "../utilities/HttpService";
import { DirectUploadService } from "./direct-upload.service";
import { SpinnerComponent } from "../utilities/spinner/spinner.component";
import { PaginatePipe, PaginationControlsCmp, IPaginationInstance } from "ng2-pagination";
import { ShowMessage, ShowError } from "../utilities/messageBox";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../app.settings";
import { FileUploadService } from '../utilities/file-upload.service.ts';

export interface DirectUploadDocument {
    documentId: number;
    fileName: string;
    uploaded: string;
}

@Component({
    templateUrl: "app/direct-upload/direct-upload.component.html",
    styleUrls: ["app/direct-upload/styles.css"],
    providers: [DirectUploadService, HttpService, FileUploadService],
    pipes: [PaginatePipe],
    directives: [SpinnerComponent, PaginationControlsCmp]
})
export class DirectUploadComponent implements OnInit {

    public paginationConfig: IPaginationInstance = {
        id: "directUpload",
        itemsPerPage: 10,
        currentPage: 1
    };

    private uploadedCertificates: DirectUploadDocument[];

    private isRequesting: boolean;
    private isUploading: boolean = false;

    private page: number = 1;
    private uploadProgress: number = 0;
    private selectedFileName: string;

    constructor(private service: DirectUploadService, private uploadService: FileUploadService) {

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

    selectionChanged($event: Event) {
        var fileList = (<HTMLInputElement>$event.srcElement).files;
        var files = <File[]>[];

        for (var i = 0; i < fileList.length; i++) {
            var element = fileList[i];
            files.push(element);
        }

        this.upload(files)
    }

    upload(files: File[]): void {
        this.uploadProgress = 0;
        this.isUploading = true;

        this.uploadService.getObserver()
            .subscribe(progress => {
                this.uploadProgress = progress;
            });

        try {
            this.uploadService.upload(this.service.UploadPath, files).then(() => {
                this.isUploading = false;
                this.search();
            })
                .catch((error: any) => {
                    this.isUploading = false;
                    ShowError("Unable to upload certificates, please try again later.", error);
                });
        } catch (error) {
            ShowError("There was an error whilst uploading the document", error);
            this.isUploading = false;
        }
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

    onPageChange(number: number) {
        this.paginationConfig.currentPage = number;
    }
}
