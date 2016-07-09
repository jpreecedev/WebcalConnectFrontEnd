import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../utilities/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ManageAccessUser, ManageAccessSite } from './manage-access.component';
import { AppSettings } from '../app.settings';

@Injectable()
export class ManageAccessService {

    constructor(private httpService: HttpService) {

    }

    getUsers(): Observable<ManageAccessUser[]> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/manageaccess/users`)
            .map((res: Response) => {
                return res.json();
            });
    }

    getConnectedSites(selectedUserId: number): Observable<ManageAccessSite[]> {
        return this.httpService.get(`${AppSettings.API_ENDPOINT}/manageaccess/sites/${selectedUserId}`)
            .map((res: Response) => {
                return res.json();
            });
    }

    toggleSite(selectedSite: ManageAccessSite): Observable<Response> {
        return this.httpService.post(`${AppSettings.API_ENDPOINT}/manageaccess/sites/`, JSON.stringify(selectedSite));
    }
}
