import { AuthService } from 'src/app/services/auth.service';
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
    displayDashbrd!: boolean
    isAuth: boolean;

    constructor(
        private router: Router,
        private authService: AuthService,
        private angularFirestore: AngularFirestore,
        public angularFireAuth: AngularFireAuth
    ) {
        this.isAuth = false;
        this.accountMenu = false;
    }

    ngOnInit(): void {
        this.getUser();
    }

    getUser() {
        this.angularFireAuth.onAuthStateChanged((user) => {
            if (user) {
                this.isAuth = true;
                this.id = user.uid;
                this.angularFirestore.collection('users').doc(user?.uid).valueChanges()
                    .subscribe((usrData: any) => {
                        this.user = usrData;
                        this.userImgURL = usrData.imageURL;
                        let role = usrData.role;
                        if (role === 'subscriber') this.displayDashbrd = false;
                        else this.displayDashbrd = true;
                    })
            }
            else this.isAuth = false;
        })
    }

    logOut = () => this.authService.logoutUser();

    goToUserProfile = () => this.router.navigate(['user-profile', this.id]);

    toggleMenu = () => (this.accountMenu === false) ? this.accountMenu = true : this.accountMenu = false;

}

/* THE END */
