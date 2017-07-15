import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app.settings';

@Injectable()
export class ChangePasswordService {

    constructor(private httpService: HttpService) {

    }
    updatePassword(currentPassword, newPassword): Observable<Response> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/changepassword/`, JSON.stringify({ currentPassword, newPassword }));
    }
}
