import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });

  firebaseErrorMessage: string;
  patientsList: any;

  constructor(private authService: AuthService, 
              private fireStore: AngularFirestore,
              private dbService: DatabaseService) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    this.getPatientsList();
  }

  submitForm() {
    if (this.form.invalid) return;
    let data = this.form.value;
    this.dbService.createPatientsList(data).then(res => {
      this.form.reset();
    });
  }

  getPatientsList = () => {
    return this.dbService.getPatientsList().subscribe(res => {
      this.patientsList = res;
    })
  }

  deletePatient = (data:any) => this.dbService.deletePatient(data);

}
