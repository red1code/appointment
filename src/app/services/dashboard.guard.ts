import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        return new Promise((resolve, reject) => {
            this.angularFireAuth.onAuthStateChanged((user) => {
                if (user) {
                    this.angularFirestore.collection('users').doc(user.uid)
                        .valueChanges().subscribe((usr: any) => {
                            if (user && (usr.role === 'admin' ||
                                usr.role === 'editor' ||
                                usr.role === 'analyst')) {
                                resolve(true);
                            } else {
                                this.router.navigate(['/home']);
                                resolve(false);
                                reject();
                            }
                        })
                } else {
                    this.router.navigate(['/home']);
                }
            });
        })
    }

}
