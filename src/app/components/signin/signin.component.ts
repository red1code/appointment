import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    loginForm!: FormGroup;
    firebaseErrorMessage: string;

    constructor(
        private router: Router,
        private authService: AuthService,
        private angularFireAuth: AngularFireAuth
    ) {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });
        this.firebaseErrorMessage = '';
    }

    ngOnInit() {
        this.isAuthenticate()
    }

    onSubmit() {
        if (this.loginForm.invalid) return;   // if loginForm isn't valid, do not submit it.
        let email = this.loginForm.value.email;
        let password = this.loginForm.value.password;
        this.authService.loginUser(email, password).then((result) => {
            if (result == null) this.router.navigate(['/waiting-list']);   // null is success.
            else if (result.isValid == false) this.firebaseErrorMessage = result.message;
        });
    }

    isAuthenticate() {
        this.angularFireAuth.onAuthStateChanged(user => {
            user ? this.router.navigate(['/waiting-list']) : null
        })
    }

}
