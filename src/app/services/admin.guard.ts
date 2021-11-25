import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            this.angularFireAuth.onAuthStateChanged((user) => {
                if (user) {
                    this.angularFirestore.collection('users').doc(user.uid)
                        .valueChanges().subscribe((usr: any) => {
                            if (user && (usr.role === 'admin')) {
                                resolve(true);
                            } else {
                                reject();
                                resolve(false);
                                this.router.navigate(['/home']);
                            }
                        })
                } else {
                    this.router.navigate(['/home']);
                }
            });
        })
    }

}
