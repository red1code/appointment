import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    user: any;
    id!: string;
    userImgURL!: string;
    accountMenu: boolean;
    isAdmin: boolean

    constructor(
        private router: Router,
        private ngFirestore: AngularFirestore,
        public angularFireAuth: AngularFireAuth
    ) {
        this.accountMenu = false;
        this.isAdmin = false;
    }

    ngOnInit(): void {
        this.getUser();
    }

    getUser() {
        this.angularFireAuth.onAuthStateChanged((user) => {
            if (user) {
                this.id = user.uid;
                if (user.email === 'redouane.bekk@gmail.com') this.isAdmin = true;
                else this.isAdmin = false;
                this.ngFirestore.collection('users').doc(this.id).valueChanges()
                    .subscribe((usr: any) => {
                        this.user = usr;
                        this.userImgURL = usr.imageURL
                    });
            }
        });
    }

    logOut = () => this.angularFireAuth.signOut();

    goToUserProfile = () => this.router.navigate(['user-profile', this.id]);

    toggleMenu() {
        if (this.accountMenu === false) return this.accountMenu = true;
        else return this.accountMenu = false;
    }

}

/* THE END */
