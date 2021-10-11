import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';

@Component({
    selector: 'app-forgot-psw',
    templateUrl: './forgot-psw.component.html',
    styleUrls: ['./forgot-psw.component.css']
})

export class ForgotPswComponent implements OnInit {

    mailSent: boolean;
    forgotPasswordForm: FormGroup;
    firebaseErrorMessage: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private location: Location,
        private angularFireAuth: AngularFireAuth
    ) {
        this.mailSent = false;
        this.forgotPasswordForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email])
        });
        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        // if the user is logged in, update the form value with their email address
        this.angularFireAuth.authState.subscribe(user => {
            if (user) {
                this.forgotPasswordForm.patchValue({
                    email: user.email
                });
            }
        });
    }

    retrievePassword() {
        if (this.forgotPasswordForm.invalid) return;
        this.authService.resetPassword(this.forgotPasswordForm.value.email)
            .then((result) => {
                if (result == null) {
                    // null is success, false means there was an error
                    console.log('password reset email sent...');
                    this.mailSent = true;
                    // this.router.navigate(['/waiting-list']);   // when the user is logged in, navigate them to Waiting List
                }
                else if (result.isValid == false) {
                    console.log('login error', result);
                    this.firebaseErrorMessage = result.message;
                }
            });
    }

    goBack = () => this.location.back();

}
