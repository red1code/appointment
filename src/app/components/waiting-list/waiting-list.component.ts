import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from 'src/app/services/database.service';
import { Patient } from 'src/app/models/patient';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

    firebaseErrorMessage: string;
    patientForm!: FormGroup;
    patientsList: any;
    patient!: Patient;
    id: string;

    constructor(
        private formBuilder: FormBuilder,
        private angularFirestore: AngularFirestore,
        private databaseService: DatabaseService,
        private ngFireAuth: AngularFireAuth,
        private authService: AuthService
    ) {
        this.firebaseErrorMessage = '';
        this.id = '';
    }

    ngOnInit(): void {
        this.getPatientsList();
        this.initForm();
    }

    onSubmitForm() {
        if (this.patientForm.invalid) return;
        this.patient = this.patientForm.value;
        if (this.id === '') {
            this.patient.created_at = new Date();
            this.patient.created_by = this.authService.userEmail;
            this.databaseService.createPatientsList(this.patient);
            this.patientForm.reset();
        } else {
            this.patient.lastUpdate = new Date();
            this.angularFirestore.collection("patientsList").doc(this.id).update(this.patient);
            this.patientForm.reset();
            this.id = '';
        }
    }

    onUpdateIcon(patient: any) {
        this.patientForm = this.formBuilder.group({
            fullName: [patient.payload.doc.data().fullName, [Validators.required]],
            phoneNumber: [patient.payload.doc.data().phoneNumber, Validators.required]
        });
        this.id = patient.payload.doc.id;
    }

    resetForm() {
        this.patientForm.reset();
        this.id = '';
    }

    checkUserPermission(patient: any): boolean {
        let userEmail = this.authService.userEmail;
        let patientEmail = patient.payload.doc.data().created_by;
        if (userEmail === patientEmail) return true;
        else return false;
    }

    getPatientsList() {
        return this.databaseService.getPatientsList().subscribe(res => {
            this.patientsList = res;
        })
    }

    initForm() {
        this.patientForm = this.formBuilder.group({
            fullName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
            phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
        });
    }

    onDelete = (data: any) => this.databaseService.deletePatient(data);

}

/* THE END */
