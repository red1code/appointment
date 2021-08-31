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
  info: any;

  constructor(public afAuth: AngularFireAuth,
              private afStore: AngularFirestore,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  logOut() {
    this.afAuth.signOut();
  }

  // getUsersList = () => {
  //   return this.authService.getUsersList().subscribe(res => {
  //     this.usersList = res;
  //   })
  // }

  getUser = () => {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.afStore.collection('users').doc(user.uid).get().subscribe((doc:any) => {
          this.user = user.email;
        })
      }
    });
  }

}
