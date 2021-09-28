import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    if (this.authService.isAuth) this.router.navigate(['/waiting-list']);
    this.initForm();    
  }

  onSubmit() {
    if (this.signupForm.invalid) return;     // if signupForm isn't valid, don't submit it.
    
    this.authService.signupUser(this.signupForm.value).then((result) => {
      if (result == null) this.router.navigate(['/waiting-list']);     // null is success, false means there was an error    
      else if (result.isValid == false) this.firebaseErrorMessage = result.message;
    });
  }

  initForm() {
    this.signupForm = new FormGroup({
      'displayName': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    });
  }

}
