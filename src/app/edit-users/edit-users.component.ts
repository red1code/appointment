import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
    selector: 'app-edit-users',
    templateUrl: './edit-users.component.html',
    styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

    users!: any;
    errMsg: string = '';

    constructor(
        private router: Router,
        private angularFirestore: AngularFirestore
    ) {
        this.getUsers();
    }

    ngOnInit(): void {

    }

    getUsers() {
        this.angularFirestore.collection<User>('users', ref => ref.orderBy('created_at'))
            .valueChanges().subscribe(usrs => {
                let i = 1;
                this.users = usrs;
                this.users = usrs.map((data: User) => {
                    return {
                        ...data,
                        created_at: data.created_at.toDate().toLocaleString(),
                        order: i++
                    }
                })
            }, (error: any) => {
                this.errMsg = error.message
            })
    }

    goToUserProfile = (id: string) => this.router.navigate(['user-profile', id]);

}
