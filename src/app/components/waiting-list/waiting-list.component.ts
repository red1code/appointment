import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  firebaseErrorMessage: string;
  patientsList: any;
  show: boolean;
  createForm!: FormGroup;
  updateForm!: FormGroup;
  id: string;
  updating: boolean;

  constructor(private formBuilder: FormBuilder,
              private fireStore: AngularFirestore,
              private dbService: DatabaseService,
              public afAuth: AngularFireAuth)
    {
      this.firebaseErrorMessage = '';
      this.show = false;
      this.updating = false;
      this.id = '';
    }

  ngOnInit(): void {
    this.getPatientsList();
    this.initForm();
  }

  getPatientsList() {
    return this.dbService.getPatientsList().subscribe(res => {
      this.patientsList = res;
    })
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    let data = this.createForm.value;
    if (this.id === '') {
      this.dbService.createPatientsList(data);
      this.createForm.reset();
    } else {
      this.fireStore.collection("patientsList").doc(this.id).update(data);
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

  onDelete = (data:any) => this.dbService.deletePatient(data);

  resetForm() {
    this.createForm.reset();
    this.id = '';
  }

}





/*

formEdited = new FormGroup({
    fullName2: new FormControl(patient.payload.doc.data().fullName, Validators.required),
    phoneNumber2: new FormControl(patient.payload.doc.data().phoneNumber, Validators.required)
  });

*/

// this.fireStore.collection("patientsList").doc(patient.payload.doc.id).update(data);
