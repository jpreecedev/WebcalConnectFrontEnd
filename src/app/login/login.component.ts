import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utilities/http.service';
import { JwtHelper } from '../utilities/JwtHelper';
import { ShowError } from '../utilities/messageBox';
import { hasValidToken } from '../utilities/Jwt';

import { AppSettings } from '../app.settings';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./styles.scss'],
    providers: [HttpService]
})
export class LoginComponent implements OnInit {

    private isRequesting = false;

    constructor(private httpService: HttpService, private router: Router, private jwtHelper: JwtHelper) {
    }

    authenticate(username: string, password: string, rememberMe: boolean): void {

        this.isRequesting = true;

        this.httpService.authenticate(username, password, rememberMe).subscribe((response: boolean) => {
            if (response) {
                this.jwtHelper.isLoggedIn = true;
                this.router.navigate(['dashboard']);
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
            this.router.navigate(['dashboard']);
        } else {
            this.jwtHelper.isLoggedIn = false;
        }
    }

}
