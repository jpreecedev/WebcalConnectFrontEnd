import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app.settings';
import { UserRegistration } from './register-user.component';

@Injectable()
export class RegisterUserService {

    constructor(private httpService: HttpService) {

    }

    getLicenseKey(expiration: string): Observable<Response> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/licenses/license/${expiration}`);
    }

    registerUser(userRegistration: UserRegistration): Observable<Response> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/registeruser/`, JSON.stringify(userRegistration));
    }

}
