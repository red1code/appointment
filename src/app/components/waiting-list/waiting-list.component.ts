import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  firebaseErrorMessage: string;
  createForm!: FormGroup;
  patientsList: any;
  id: string;

  constructor(private formBuilder: FormBuilder,
              private angularFirestore: AngularFirestore,
              private databaseService: DatabaseService,
              public afAuth: AngularFireAuth)
    {
      this.firebaseErrorMessage = '';
      this.id = '';
    }

  ngOnInit(): void {
    this.getPatientsList();
    this.initForm();
  }

  getPatientsList() {
    return this.databaseService.getPatientsList().subscribe(res => {
      this.patientsList = res;
    })
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', Validators.required]
    });
  }

  onSubmitForm() {
    let data = this.createForm.value;
    if (this.id === '') {
      this.databaseService.createPatientsList(data);
      this.createForm.reset();
    } else {
      this.angularFirestore.collection("patientsList").doc(this.id).update(data);
      this.createForm.reset();
      this.id = '';
    }     
  }  

  onUpdateIcon(patient: any) {
    this.createForm = this.formBuilder.group({
      fullName: [patient.payload.doc.data().fullName, [Validators.required]],
      phoneNumber: [patient.payload.doc.data().phoneNumber, Validators.required]
    });
    this.id = patient.payload.doc.id;
  }

  onDelete = (data:any) => this.databaseService.deletePatient(data);

  resetForm() {
    this.createForm.reset();
    this.id = '';
  }

}
