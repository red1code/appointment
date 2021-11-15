import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TableColumn } from 'src/app/models/tablesCols';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    currentUser!: User;
    users: any[] = [];
    patients: any[] = [];
    canEditUsrs: boolean = false;

    usrsPerMonth!: number[];
    usrsLabel: string = 'User';
    usrsChartTitle: string = 'User per month'

    rdvMonths!: string[];
    rdvPerMonth!: number[];
    rdvLabel: string = 'Rendezvous';
    rdvChartTitle: string = 'Rendezvous per month';

    months: string[] = Array.from({ length: 12 }, (item, i) => {
        return new Date(0, i).toLocaleString('en', { month: 'long' })
    });

    usersCols: TableColumn[] = [
        { title: 'Order', data: 'order' },
        { title: 'First name', data: 'firstName' },
        { title: 'Last name', data: 'familyName' },
        { title: 'Email', data: 'email' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Created At', data: 'created_at' },
        { title: 'Role', data: 'role' }
    ];
    rdvsCols: TableColumn[] = [
        { title: 'Order', data: 'id' },
        { title: 'Display Name', data: 'displayName' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Created At', data: 'created_at' },
        { title: 'Last Update', data: 'lastUpdate' }
    ];

    constructor(
        private router: Router,
        private databaseService: DatabaseService,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) {
        this.getUsers();
        this.getPatients();
        this.getCurrentUser();
    }

    ngOnInit(): void { }

    getUsers = () => this.angularFirestore.collection<User>('users', ref => {
        return ref.orderBy('created_at')
    }).snapshotChanges().subscribe(result => {
        this.users = result;
        this.users = this.users.map((usr: any) => {
            return {
                ...usr.payload.doc.data(),
                id: usr.payload.doc.id,
            }
        })
        let i = 1;
        this.users.map(usr => {
            usr.created_at = usr.created_at.toDate().toLocaleString()
            usr.order = i;
            i++;
        });
        let usrMonths = result.map((m: any) => {
            return m.payload.doc.data().created_at.toDate()
                .toLocaleString('en', { month: 'long' });
        });
        this.usrsPerMonth = this.months.map(
            month => usrMonths.filter(val => val == month).length);
    })

    // rendezvous methods.
    getPatients() {
        this.databaseService.getPatientsList().subscribe(result => {
            let results = result;
            this.patients = results.map((patient: any) => {
                return {
                    rdvID: patient.payload.doc.id,
                    ...patient.payload.doc.data()
                }
            });
            let i = 1;
            this.patients.map(rdv => {
                rdv.created_at = rdv.created_at.toDate().toLocaleString();
                if (rdv.lastUpdate !== 'Not updated') {
                    rdv.lastUpdate = rdv.lastUpdate.toDate().toLocaleString();
                }
                rdv.id = i;
                i++;
            });
            // making an array of numbers of rendezvous in every month:
            let rdvMonths = results.map((p: any) => {
                return p.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });
            this.rdvPerMonth = this.months.map(
                month => rdvMonths.filter(val => val == month).length);
        })
    }

    deleteUserByID(id: string) { }

    getCurrentUser() {
        this.angularFireAuth.onAuthStateChanged((user) => {
            if (user) {
                let id = user.uid;
                this.angularFirestore.collection('users').doc(id).valueChanges()
                    .subscribe((usr: any) => {
                        this.currentUser = usr;
                    });
            }
        });
    }

    emptyRdvList = () => (this.patients.length === 0) ? true : false;

    onDeletePatient = (data: any) => this.databaseService.deletePatient(data);

    onEditUsers() {
        (this.canEditUsrs === true) ? this.canEditUsrs = false : this.canEditUsrs = true;
    }

    goToUserProfile = (id: string) => this.router.navigate(['user-profile', id]);

    adminPermission = () => (this.currentUser.role === 'admin') ? true : false;

    editorPermission = () => (this.currentUser.role === 'editor') ? true : false;

    analystPermission = () => (this.currentUser.role === 'analyst') ? true : false;

}

// THE END.



/*

datePipe = 'MMMM d, y - hh:mm aa';

*/