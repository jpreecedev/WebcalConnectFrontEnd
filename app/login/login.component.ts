import { Component, OnInit } from "angular2/core";
import { Router } from "angular2/router";
import { HttpService } from "../utilities/HttpService";
import { hasValidToken } from "../utilities/Jwt";

@Component({
    templateUrl: "app/login/login.component.html",
    styleUrls: ["app/login/styles.css"],
    providers: [HttpService]
})
export class LoginComponent implements OnInit {

    constructor(private _httpService: HttpService, private _router: Router) {

    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this._httpService.authenticate(username, password, rememberMe)
            .then((response: boolean) => {
                if (response) {
                    this._router.parent.navigate(["Dashboard"]);
                }
            });

    }
    
    ngOnInit(){
     if (hasValidToken()){
         this._router.parent.navigate(["Dashboard"]);
     }   
    }

}
