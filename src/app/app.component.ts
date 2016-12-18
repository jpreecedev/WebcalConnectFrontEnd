import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from './utilities/JwtHelper';

import '../style/app.scss';

export interface MenuItem {
    icon: string;
    routerLink: string;
    text: string;
}

@Component({
    selector: 'wc-app',
    templateUrl: './app.component.html',
    styleUrls: ['./styles.scss']
})
export class AppComponent {
    constructor(private router: Router, private jwtHelper: JwtHelper) {
    }

    logout(): void {
        this.jwtHelper.logout();
        this.router.navigate(['']);
    }
}
