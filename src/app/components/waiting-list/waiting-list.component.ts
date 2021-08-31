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
  show: boolean;
  userEmail: any;
  fUserEmail: any;
  carrier: any;

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });

  formEdited!: FormGroup;

  constructor(private authService: AuthService, 
              private fireStore: AngularFirestore,
              private dbService: DatabaseService,
              public afAuth: AngularFireAuth,
              private dialog: MatDialog) {
                
    this.firebaseErrorMessage = '';
    this.show = false;
  }

  ngOnInit(): void {
    this.getPatientsList();
    this.getAuthEmail();
    this.getFstoreEmail();
  }

  getAuthEmail = () => {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    })
  }

  getFstoreEmail() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.fireStore.collection('patientsList').doc(user.uid).get().subscribe(() => {
          this.fUserEmail = user.email;
        })
      }
    })
  }

  submitForm = () => {
    if (this.form.invalid) return;
    let data = this.form.value;
    this.dbService.createPatientsList(data);
    this.form.reset();
    
  }

  getPatientsList = () => {
    return this.dbService.getPatientsList().subscribe(res => {
      this.patientsList = res;
    })
  }

  deletePatient = (data:any) => this.dbService.deletePatient(data);

  editInfo = (patient:any) => {
    this.show = true;
    this.formEdited = new FormGroup({
      fullName2: new FormControl(patient.payload.doc.data().fullName, Validators.required),
      phoneNumber2: new FormControl(patient.payload.doc.data().phoneNumber, Validators.required)
    });
    this.carrier = patient;
  }

  updateForm = () => {
    if (this.formEdited.invalid) return;
    if (!this.formEdited.valueChanges) return;
    let data = this.formEdited.value;
    this.fireStore.collection("patientsList").doc(data.payload.doc.id).update({
      fullName: data.fullName2,
      phoneNumber: data.phoneNumber2
    }).then(() => {
      this.formEdited.reset();
      this.show = false;
    }); 
  }

}





/*

formEdited = new FormGroup({
    fullName2: new FormControl(patient.payload.doc.data().fullName, Validators.required),
    phoneNumber2: new FormControl(patient.payload.doc.data().phoneNumber, Validators.required)
  });

*/

// this.fireStore.collection("patientsList").doc(patient.payload.doc.id).update(data);
