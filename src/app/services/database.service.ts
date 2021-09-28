import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private firestore: AngularFirestore) { }

    createPatientsList(data: any) {
        return new Promise<any>(() => {
            this.firestore.collection('patientsList').add(data);
        });
    }

    getPatientsList() {
        return this.firestore.collection('patientsList').snapshotChanges();
    }

    deletePatient(data: any) {
        if (confirm(`Are you sure You want to delete "${data.payload.doc.data().fullName}"?`)) {
            this.firestore.collection("patientsList").doc(data.payload.doc.id).delete();
        }
    }

    updatePatientInfos(data: any) {
        return this.firestore.collection("patientsList").doc(data.payload.doc.id).update({
            fullName: data.fullName2,
            phoneNumber: data.phoneNumber2
        });
    }

    dateFormat(data: any) {
        let date = new Date(data);

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDay();
        let hour = date.getHours();
        let min = date.getMinutes();

        return `${month} ${day}, ${year} --- ${hour}:${min}`;
    }

}





/*

return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      min: min
}


{
  fullName: data.fullName.value,
  phoneNumber: data.phoneNumber.value,
  email: this.auth.onAuthStateChanged((user:any) => {
    if (user) {
      return user.email;
    }
  })
}

*/