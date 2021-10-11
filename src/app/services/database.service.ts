import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private angularFirestore: AngularFirestore) { }

    // patients data
    createNewPatient(data: any) {
        return new Promise<any>(() => {
            this.angularFirestore.collection('patientsList').add(data);
        });
    }

    getPatientsList() {
        return this.angularFirestore.collection('patientsList').snapshotChanges();
    }

    updatePatient(id: string, patient: any) {
        return new Promise(() => {
            this.angularFirestore.collection("patientsList").doc(id).update(patient);
        })
    }

    deletePatient(data: any) {
        if (confirm(`Are you sure You want to delete "${data.payload.doc.data().fullName}"?`)) {
            this.angularFirestore.collection("patientsList").doc(data.payload.doc.id).delete();
        }
    }

    // users data
    getUsersList() {
        return this.angularFirestore.collection('users').snapshotChanges();
    }

}
