import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Patient } from 'src/app/models/patient';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  newPatient: FormGroup;
  firebaseErrorMessage: string;
  name!: string;
  phone!: string;
  // patientsList = getObservable(this.store.collection('patientsList'));

  constructor(private authService: AuthService, private fireStore: AngularFirestore) {
    this.newPatient = new FormGroup({
      fullName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
    });
    this.firebaseErrorMessage = '';
  }


  ngOnInit(): void {
  }

  submitForm() {
    if (this.newPatient.invalid) return;
    this.authService.addPatient(this.name, this.phone).then(
      (result) => {
        if (result == null) {
          this.name = '';
          this.phone = '';
        }
      }
    );
    
  }

}



/*

import { AngularFirestore } from 'angularfire2/firestore';

constructor(private fireStore: AngularFirestore) {}

DocID = const docID = firebase.firestore().collection('products').doc(doc).doc().id;
this.fireStore.collection('products').doc(this.docid).set(
  {
    docID,
    productName,
    productDescription,
    addedAt,
    uploadedBy,
    imageURL,
    price,
    status
  }
);

*/