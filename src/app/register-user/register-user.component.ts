import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../utilities/http.service';
import { Response } from '@angular/http';
import { RegisterUserService } from './register-user.service';
import { ShowMessage, ShowError } from '../utilities/messageBox';

export interface UserRegistration {
    emailAddress: string;
    companyName: string;
    expiration: string;
    licenseKey: string;
    password: string;
}

@Component({
    templateUrl: './register-user.component.html',
    styleUrls: ['./styles.scss'],
    providers: [RegisterUserService, HttpService]
})
export class RegisterUserComponent {

    private userRegistration: UserRegistration;
    private isRequesting: boolean = false;
    private validationErrors: string;
    private confirmPassword: string;

    constructor(private router: Router, private service: RegisterUserService) {
        this.resetForm();
    }

    getLicenseKey(expiration: string): void {
        this.userRegistration.expiration = expiration;
        this.service.getLicenseKey(expiration).subscribe((response: Response) => {
            this.userRegistration.licenseKey = response.json().key;
        });
    }

    submit(): void {
        if (!this.validateForm()) {
            return;
        }

        this.isRequesting = true;
        this.service.registerUser(this.userRegistration).subscribe(() => {
            this.resetForm();
            ShowMessage('The user was registered successfully');
        },
        (error: any) => {
            this.isRequesting = false;
            ShowError('Unable to register user, please try again later.', error);
        },
        () => {
            this.isRequesting = false;
        });
    }

    validateForm(): boolean {
        this.validationErrors = '';

        if (!this.userRegistration.password || this.userRegistration.password.length < 6) {
            this.validationErrors = 'Password is too short<br/>';
        }
        if (!this.confirmPassword || this.confirmPassword.length < 6) {
            this.validationErrors += 'Confirm password is too short<br/>';
        }
        if (this.userRegistration.password !== this.confirmPassword) {
            this.validationErrors += 'Passwords do not match<br/>';
        }

        return !this.validationErrors;
    }

    cancel(): void {
        this.router.navigate(['Dashboard']);
    }

    resetForm(): void {
        this.userRegistration = {
            emailAddress: '',
            companyName: '',
            expiration: '',
            licenseKey: '',
            password: ''
        };

        this.confirmPassword = '';
    }

}
