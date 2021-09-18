import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) {}

  createPatientsList(data:any) {
    return new Promise<any>(() => {
      this.firestore.collection('patientsList').add(data);
    });
  }

  getPatientsList() {
    return this.firestore.collection('patientsList').snapshotChanges();
  }

  deletePatient(data: any) {
    if (confirm("Are you sure You wanna delete this?")) {
      this.firestore.collection("patientsList").doc(data.payload.doc.id).delete();
    }
    
  }

  updatePatientInfos(data: any) {
    return this.firestore.collection("patientsList").doc(data.payload.doc.id).update({
      fullName: data.fullName2,
      phoneNumber: data.phoneNumber2
    });
  }

}





/*

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