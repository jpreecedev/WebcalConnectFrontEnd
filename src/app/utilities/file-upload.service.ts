import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { JwtHelper } from './JwtHelper';

@Injectable()
export class FileUploadService {

    private progress$: Observable<{}>;
    private progress = 0;
    private progressObserver: any;

    constructor(private jwtHelper: JwtHelper) {
        this.progress$ = new Observable((observer: any) => {
            this.progressObserver = observer;
        });
    }

    public getObserver(): Observable<{}> {
        return this.progress$;
    }

    public upload(url: string, files: File[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('uploads[]', files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve();
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                if (this.progressObserver) {
                    this.progressObserver.next(this.progress);
                }
            };

            xhr.open('POST', url, true);

            let token = this.jwtHelper.getToken();
            if (token && token.access_token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
            }

            xhr.send(formData);
        });
    }
}
