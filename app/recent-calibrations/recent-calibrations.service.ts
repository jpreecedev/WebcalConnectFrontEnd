import {Injectable} from "angular2/core";
import {Response} from "angular2/http";
import {HttpService} from "../utilities/HttpService";

@Injectable()
export class RecentCalibrationsService{
    
    constructor(private _httpService: HttpService) {
        
    }
    
    getRecent(){
        return this._httpService.get("http://localhost:50139/api/recentcalibrations")
        .then((response:Response) => response.json());
    }
    
}