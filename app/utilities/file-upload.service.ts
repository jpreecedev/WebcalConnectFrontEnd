import {Component, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";
import {JwtHelper} from "./JwtHelper";
import {IJwt} from "./Jwt";

@Injectable()
export class FileUploadService {

    private progress$: Observable<number>;
    private progress: number = 0;
    private progressObserver: any;

    constructor(private jwtHelper: JwtHelper) {
        this.progress$ = new Observable((observer: any) => {
            this.progressObserver = observer
        });
    }

    public getObserver(): Observable<number> {
        return this.progress$;
    }

    public upload(url: string, files: File[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
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
                this.progressObserver.next(this.progress);
            };

            xhr.open("POST", url, true);
            xhr

            var token: IJwt = this.jwtHelper.getToken();
            if (token && token.access_token) {
                xhr.setRequestHeader("Authorization", "Bearer " + token.access_token);
            }

            xhr.send(formData);
        });
    }
}