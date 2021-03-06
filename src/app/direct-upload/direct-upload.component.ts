import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { DirectUploadService } from './direct-upload.service';
import { ShowError } from '../utilities/messageBox';
import { FileUploadService } from '../utilities/file-upload.service';

export interface DirectUploadDocument {
    documentId: number;
    fileName: string;
    uploaded: string;
}

@Component({
    templateUrl: './direct-upload.component.html',
    styleUrls: ['./styles.scss'],
    providers: [DirectUploadService, HttpService, FileUploadService]
})
export class DirectUploadComponent implements OnInit {

    public paginationConfig = {
        id: 'directUpload',
        itemsPerPage: 10,
        currentPage: 1
    };

    public uploadedCertificates: DirectUploadDocument[];
    public isRequesting: boolean;
    public isUploading = false;
    private uploadProgress = 0;

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
                ShowError('Unable to get list of direct upload certificates, please try again later.', error);
            },
            () => {
                this.isRequesting = false;
            });
    }

    selectionChanged($event: Event) {
        let fileList = (<HTMLInputElement>$event.srcElement).files;
        let files = <File[]>[];

        for (let i = 0; i < fileList.length; i++) {
            let element = fileList[i];
            files.push(element);
        }

        this.upload(files);
    }

    upload(files: File[]): void {
        this.uploadProgress = 0;
        this.isUploading = true;

        this.uploadService.getObserver()
            .subscribe(progress => {
                this.uploadProgress = <number>progress;
            });

        try {
            this.uploadService.upload(this.service.UploadPath, files).then(() => {
                this.isUploading = false;
                this.search();
            })
                .catch((error: any) => {
                    this.isUploading = false;
                    ShowError('Unable to upload certificates, please try again later.', error);
                });
        } catch (error) {
            ShowError('There was an error whilst uploading the document', error);
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
