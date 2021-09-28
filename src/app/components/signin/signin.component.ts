import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm!: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    if (this.authService.isAuth) this.router.navigate(['/waiting-list']);
    this.initForm();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;     // if signupForm isn't valid, don't submit it.
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    this.authService.loginUser(email, password).then((result) => {
      if (result == null) this.router.navigate(['/waiting-list']);     // null is success.
      else if (result.isValid == false) this.firebaseErrorMessage = result.message;
    });
  }

  initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    });
  }

}
