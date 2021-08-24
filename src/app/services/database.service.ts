import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  createPatientsList(data:any) {
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection('patientsList').add(data)
      .then(res => {
        resolve(res);
        console.log(res);
      }, err => {
        reject(err);
        console.log(err);
      });
    });
  }

  getPatientsList() {
    return this.firestore.collection('patientsList').snapshotChanges();
  }

  deletePatient(data: any) {
    return this.firestore.collection("patientsList").doc(data.payload.doc.id).delete();
  }

}
