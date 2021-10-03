import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isAuth!: boolean;
    userEmail!: string;
    userID!: any;
    profileImgURL!: any;

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore,
        private angularFireStorage: AngularFireStorage
    ) {
        this.getUser();
    }

    async createNewUser(user: User): Promise<any> {
        return await this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result: any) => {
                result.user.sendEmailVerification();
                user.id = result.user.uid;
                user.created_at = new Date();
                user.imageURL = 'https://firebasestorage.googleapis.com/v0/b/appointment-d19b2.appspot.com/o/profile-pictures%2Funknown-profile-picture.jpg?alt=media&token=f3904851-9e74-49d1-b23d-7149cf2348c0';
                user.password = "PASSWORD CAN'T BE SAVED HERE";
                this.angularFirestore.doc('/users/' + user.id).set(user);
            }).catch((error): any => {
                console.log('Auth Service: signup error', error);
                if (error.code)
                    return {
                        isValid: false,
                        message: error.message
                    };
            });
    }

    async loginUser(email: string, password: string): Promise<any> {
        return await this.angularFireAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Auth Service: loginUser: success');
                this.router.navigate(['/waiting-list']);
            })
            .catch((error): any => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    async resetPassword(email: string): Promise<any> {
        return await this.angularFireAuth.sendPasswordResetEmail(email)
            .then(() => console.log('Auth Service: reset password success'))
            .catch(error => {
                console.log('Reset password error :');
                console.log(error.code);
                console.log(error)
                if (error.code) return error;
            });
    }

    // async resendVerificationEmail() {                         // verification email is sent in the Sign Up function, but if you need to resend, call this function
    //   return (await this.afAuth.currentUser).sendEmailVerification()
    //     .then(() => {
    //       // this.router.navigate(['/home']);
    //     })
    //     .catch(error => {
    //       console.log('Auth Service: sendVerificationEmail error...');
    //       console.log('error code', error.code);
    //       console.log('error', error);
    //       if (error.code)
    //         return error;
    //     });
    // }

    async logoutUser(): Promise<void> {
        return await this.angularFireAuth.signOut()
            .then(() => {
                this.router.navigate(['/home']);                    // when we log the user out, navigate them to home
            })
            .catch(error => {
                console.log('Auth Service: logout error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return error;
            });
    }

    deleteUser() {
        this.angularFireAuth.currentUser.then((usr) => {
            this.userID = usr?.uid;
            this.angularFirestore.collection('users').doc(usr?.uid).valueChanges()
                .subscribe((result: any) => {
                    this.profileImgURL = result.imageURL;
                    this.angularFireStorage.storage.refFromURL(this.profileImgURL).delete().then(
                        () => this.angularFirestore.collection('users').doc(this.userID).delete().then(
                            () => usr?.delete()
                        )
                    )
                })
        })
    }

    getUsersList() {
        return this.angularFirestore.collection('users').snapshotChanges();
    }

    getUser() {
        this.angularFireAuth.onAuthStateChanged((usr: any) => {
            if (usr) {
                this.isAuth = true;
                this.userEmail = usr.email;
                this.userID = usr.uid;
            } else {
                this.isAuth = false;
            }
        })
    }

}
