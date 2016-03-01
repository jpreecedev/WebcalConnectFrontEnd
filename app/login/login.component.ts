import { Component } from 'angular2/core';
import { LoginService } from './login.service';

@Component({
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/styles.css'],
    providers: [LoginService]
})
export class LoginComponent {

    constructor(private _loginService: LoginService) {
        
    }

    authenticate(username: string, password: string, rememberMe: boolean) {
        
        this._loginService.authenticate(username, password, rememberMe)
            .then((response: boolean) => {
                if (response){
                    window.location.href
                }
            })
        
    }

}
