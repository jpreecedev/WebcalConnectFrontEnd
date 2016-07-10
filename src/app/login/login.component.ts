import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HttpService } from '../utilities/http.service';
import { JwtHelper } from '../utilities/JwtHelper';
import { WCButtonComponent } from '../utilities/wc-button/wc-button.component';
import { ShowError } from '../utilities/messageBox';
import { hasValidToken } from '../utilities/Jwt';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./styles.scss'],
    providers: [HttpService],
    directives: [WCButtonComponent]
})
export class LoginComponent implements OnInit {

    private isRequesting: boolean = false;

    constructor(private httpService: HttpService, private router: Router, private jwtHelper: JwtHelper) {
    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this.isRequesting = true;
        this.httpService.authenticate(username, password, rememberMe).subscribe((response: boolean) => {
            if (response) {
                this.jwtHelper.isLoggedIn = true;
                this.router.navigate(['Dashboard']);
            }
        },
            (error: any) => {
                ShowError('Unable to log in at this time, please try again later.', error);
                this.isRequesting = false;
            },
            () => {
                this.isRequesting = false;
            });
    }

    ngOnInit(): void {
        if (hasValidToken()) {
            this.jwtHelper.isLoggedIn = true;
            this.router.navigate(['Dashboard']);
        } else {
            this.jwtHelper.isLoggedIn = false;
        }
    }

}
