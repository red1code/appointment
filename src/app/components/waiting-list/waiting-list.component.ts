import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Patient } from 'src/app/models/patient';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  newPatient!: FormGroup;
  firebaseErrorMessage: string;
  name = new FormControl('');
  phone = new FormControl('');

  constructor(private authService: AuthService, private fireStore: AngularFirestore) {
    this.firebaseErrorMessage = '';
  }


  ngOnInit(): void {
    this.newPatient = new FormGroup({
      'fullName': new FormControl('', Validators.required),
      'phoneNumber': new FormControl('', Validators.required),
    });
  }

  submitForm() {
    // if (this.newPatient.invalid) return;
    this.fireStore.doc('/patientsList/' + this.name.value).set({
      name: this.name.value,
      phone: this.phone.value
    }).then(() => {
      this.name.setValue('');
      this.phone.setValue('');
    }).catch(err => {
      this.firebaseErrorMessage = err;
    })
  }

}
