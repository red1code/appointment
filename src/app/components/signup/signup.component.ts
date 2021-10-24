import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    signupForm: FormGroup;
    firebaseErrorMessage: string;
    user!: User;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private angularFireAuth: AngularFireAuth
    ) {
        this.signupForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
            familyName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
            phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
        })
        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        this.isAuthenticate()
    }

    onSubmit() {
        if (this.signupForm.invalid) return;   // if signupForm isn't valid, don't submit it.
        this.user = this.signupForm.value;
        this.authService.createNewUser(this.user).then((result) => {
            if (result == null) this.router.navigate(['/waiting-list']);   // null is success, false means there was an error    
            else if (result.isValid == false) this.firebaseErrorMessage = result.message;
        });
    }

    isAuthenticate() {
        this.angularFireAuth.onAuthStateChanged(user => {
            user ? this.router.navigate(['/waiting-list']) : null
        })
    }

}
