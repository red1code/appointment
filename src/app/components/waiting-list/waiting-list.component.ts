import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/services/database.service';
import { MatDialog }from '@angular/material/dialog';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  firebaseErrorMessage: string;
  patientsList: any;

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, 
              private fireStore: AngularFirestore,
              private dbService: DatabaseService,
              private dialog: MatDialog) {
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

  editInfo = (patient:any) => {
    let formEdited = this.form = new FormGroup({
      fullName: new FormControl(patient.payload.doc.data().fullName, Validators.required),
      phoneNumber: new FormControl(patient.payload.doc.data().phoneNumber, Validators.required)
    });
    if (formEdited.invalid) return;
    let data = formEdited.value;
    this.fireStore.collection("patientsList").doc(patient.payload.doc.id).update(data);
  }

}
