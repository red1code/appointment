import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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
                if (user) {
                    resolve(true);
                } else {
                    console.log('Auth guard : user is not logged in');
                    this.router.navigate(['/home']);
                    resolve(false);
                    reject();
                }
            });
        });
    }

}
