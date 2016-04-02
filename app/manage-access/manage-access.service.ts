import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {ManageAccessUser, ManageAccessSite} from "./manage-access.component";

@Injectable()
export class ManageAccessService {

    constructor(private _httpService: HttpService) {

    }

    getUsers(): Observable<ManageAccessUser[]> {
        return this._httpService.get("http://localhost:50139/api/manageaccess/users")
            .map((res: Response) => {
                return res.json();
            });
    }

    getConnectedSites(selectedUserId: number): Observable<ManageAccessSite[]> {
        return this._httpService.get("http://localhost:50139/api/manageaccess/sites/" + selectedUserId)
            .map((res: Response) => {
                return res.json();
            });
    }

    toggleSite(selectedSite: ManageAccessSite): Observable<Response> {
        return this._httpService.post("http://localhost:50139/api/manageaccess/sites/", JSON.stringify(selectedSite));
    }
}
