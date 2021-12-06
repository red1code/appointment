import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Patient } from 'src/app/models/patient';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

    id: string = '';
    patient!: Patient;
    patientForm: FormGroup;
    patientsList!: Observable<Patient[]>;
    firebaseErrorMessage: string = '';
    datePipe: string = 'MMMM d, y - hh:mm aa';
    tHead: string[] = ['Order', 'Full Name', 'Phone Number', 'Created At', 'Last update'];

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private databaseService: DatabaseService
    ) {
        this.patientForm = this.formBuilder.group({
            displayName: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
            phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
        });
    }

    ngOnInit(): void {
        this.getPatientsList();
    }

    getPatientsList() {
        this.patientsList = this.databaseService.getPatientsList().pipe(
            map(actions => {
                let i = 1;
                return actions.map(rdv => {
                    let load = rdv.payload.doc.data()
                    return {
                        rdvID: rdv.payload.doc.id,
                        ...load,
                        created_at: load.created_at.toDate().toLocaleString(),
                        lastUpdate: load.lastUpdate ? load.lastUpdate.toDate().toLocaleString() :
                            'Not updated',
                        order: i++
                    }
                })
            })
        )
    }

    onSubmitForm() {
        if (this.patientForm.invalid) return;
        this.patient = this.patientForm.value;
        if (this.id === '') {
            this.patient.created_at = new Date();
            this.patient.created_by = this.authService.userEmail;
            this.databaseService.createNewPatient(this.patient);
            this.patientForm.reset();
        } else {
            this.patient.lastUpdate = new Date();
            this.databaseService.updatePatient(this.id, this.patient);
            this.patientForm.reset();
            this.id = '';
        }
    }

    onUpdateIcon(patient: any) {
        this.patientForm = this.formBuilder.group({
            displayName: [patient.displayName, [Validators.required]],
            phoneNumber: [patient.phoneNumber, Validators.required]
        });
        this.id = patient.rdvID;
    }    

    emptyList() {
        let list = this.patientsList as unknown as Array<any>;
        (list.length === 0) ? true : false;
    }

    onDelete = (data: any) => this.databaseService.deletePatient(data);

    checkUserPermission(patient: any): boolean {
        let currentUser = this.authService.currentUser;
        let role = currentUser.role;
        let userEmail = currentUser.email;
        let patientEmail = patient.created_by;
        if (userEmail === patientEmail || role === 'admin' || role === 'editor')
            return true;
        else return false;
    }

    resetForm() {
        this.id = '';
        this.patientForm.reset();
    }

}

// THE END.



/*
return this.databaseService.getPatientsList().subscribe((res: any) => {
    // in order to get rid of "payload.doc.data()" I added these steps:
    let results = res;
    this.patientsList = results.map((rdv: any) => {
        return {
            ...rdv.payload.doc.data(),
            rdvID: rdv.payload.doc.id
        }
    });
    let i = 1;
    this.patientsList.map(rdv => {
        rdv.order = i;
        i++;
    })
})
*/