import { User } from 'src/app/models/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userEmail!: string;
    userID!: string;
    userRole!: string;
    currentUser!: any;
    role!: string;

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore,
        private angularFireStorage: AngularFireStorage
    ) {
        this.getUser();
        this.angularFireAuth.onAuthStateChanged(user => {
            if (user) {
                this.angularFirestore.collection('users').doc(user.uid).valueChanges()
                    .subscribe((result: any) => {
                        this.role = result.role;
                    });
            }
        })
    }

    getUser() {
        return this.angularFireAuth.onAuthStateChanged((usr: any) => {
            if (usr) {
                this.userEmail = usr.email;
                this.userID = usr.uid;
                this.angularFirestore.collection('users')
                    .doc(usr.uid).valueChanges().subscribe(
                        res => this.currentUser = res
                    )
            }
        })
    }

    async createNewUser(user: User): Promise<any> {
        return await this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result: any) => {
                result.user.sendEmailVerification();
                user.password = '';
                user.role = 'subscriber';
                user.uid = result.user.uid;
                user.created_at = new Date();
                user.imageURL = 'assets/unknown-profile-picture.png';
                this.angularFirestore.doc('/users/' + user.uid).set(user)
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
            .then(() => this.router.navigate(['/home']))                    // when we log the user out, navigate them to home
            .catch(error => {
                console.log('Auth Service: logout error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code) return error;
            });
    }

    // this methode will delete the current user that is signed in
    deleteUser() {
        this.angularFireAuth.currentUser.then((usr: any) => {
            let uid = usr?.uid;
            this.angularFirestore.collection('users').doc(uid).valueChanges()
                .subscribe((result: any) => {
                    let imgURL = result.imageURL;
                    let picPath = imgURL.slice(0, 6);
                    if (picPath !== "assets") {
                        this.angularFireStorage.storage.refFromURL(imgURL).delete()
                            .then(() => this.angularFirestore.collection('users')
                                .doc(uid).delete().then(() => usr?.delete()))
                    } else {
                        this.angularFirestore.collection('users').doc(uid)
                            .delete().then(() => usr?.delete())
                    }
                })
        })
    }

    deleteSpecificUser(id: string) {
    }

    getUsersList = () => this.angularFirestore.collection('users').snapshotChanges();

    checkAuthorization(user: User, allowedRoles: string[]): boolean {
        if (!user) return false;
        for (const role of allowedRoles) {
            if (user.role === role) return true
        }
        return false
    }

    canRead(user: User): boolean {
        const allowed = ['admin', 'editor', 'analyst', 'subscriber'];
        return this.checkAuthorization(user, allowed)
    }

    canEdit(user: User): boolean {
        const allowed = ['admin', 'editor'];
        return this.checkAuthorization(user, allowed)
    }

    canDelete(user: User): boolean {
        const allowed = ['admin'];
        return this.checkAuthorization(user, allowed)
    }

    isAdmin(): boolean {
        if (this.role === 'admin') return true;
        else return false;
    }

}
