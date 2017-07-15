import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { HttpService } from '../utilities/http.service';
import { ChangePasswordService } from './change-password.service';
import { ShowError } from '../utilities/messageBox';
import { JwtHelper } from '../utilities/JwtHelper';

@Component({
    templateUrl: './change-password.component.html',
    styleUrls: ['./styles.scss'],
    providers: [ChangePasswordService, HttpService]
})
export class ChangePasswordComponent {

    public currentPassword: string;
    public newPassword: string;
    public repeatPassword: string;

    public isUpdating: Boolean = false;

    constructor(private service: ChangePasswordService, private router: Router, private jwtHelper: JwtHelper) {

    }

    updatePassword() {
        if (this.newPassword !== this.repeatPassword) {
          ShowError('Passwords do not match', null);
          return;
        }

        this.isUpdating = true;
        this.service.updatePassword(this.currentPassword, this.newPassword).subscribe((response: Response) => {
            this.isUpdating = false;
            this.jwtHelper.logout();
            this.router.navigate(['login']);
        },
        (error: any) => {
            this.isUpdating = false;
            ShowError('Unable to update password, please try again later.', error);
        },
        () => {
            this.isUpdating = false;
        });
    }
}
