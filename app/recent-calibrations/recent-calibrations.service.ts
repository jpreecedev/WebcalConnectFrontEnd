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
    
    downloadCertificate(id:Number, documentType:string){
        
        this._httpService.get(`http://localhost:50139/api/resource/certificate/${id}/${documentType}`)
            .then((response: Response)=>{
                window.open("data:application/pdf;base64," + response.text());
            });
    }
    
}