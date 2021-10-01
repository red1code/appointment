import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    user: any;
    id!: string;
    userImgURL!: string;

    constructor(
        public angularFireAuth: AngularFireAuth,
        private ngFirestore: AngularFirestore,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getUser();
    }

    logOut = () => this.angularFireAuth.signOut();

    getUser() {
        this.angularFireAuth.onAuthStateChanged((user) => {
            if (user) {
                this.id = user.uid;
                this.ngFirestore.collection('users').doc(this.id).valueChanges()
                    .subscribe((usr: any) => {
                        this.user = `${usr.firstName} ${usr.familyName}`
                        this.userImgURL = usr.imageURL
                    })
            }
        });
    }

}

/* THE END */
