import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        return new Promise((resolve, reject) => {
            this.angularFireAuth.onAuthStateChanged((user) => {
                if (user && user.email === 'redouane.bekk@gmail.com') {
                    resolve(true);
                } else {
                    this.router.navigate(['/home']);
                    resolve(false);
                    reject();
                }
            });
        });
    }

}
