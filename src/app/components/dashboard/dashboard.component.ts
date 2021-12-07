import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TableColumn } from 'src/app/models/tablesCols';
import { AngularFireAuth } from '@angular/fire/auth';
import { Patient } from 'src/app/models/patient';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    currentUser!: User;
    canEditUsrs: boolean = false;
    months: string[] = Array.from({ length: 12 }, (item, i) => {
        return new Date(0, i).toLocaleString('en', { month: 'long' })
    });

    // users properties    
    users!: Observable<User[]>;
    usrsError: string = '';
    usrsChartID: string = 'usr-chart';
    usrsChartType: string = 'bar';
    usrsPerMonth!: number[];
    usrsLabel: string = 'User';
    usrsChartTitle: string = 'Users per month';
    usersCols: TableColumn[] = [
        { title: 'Order', data: 'order' },
        { title: 'First name', data: 'firstName' },
        { title: 'Last name', data: 'familyName' },
        { title: 'Email', data: 'email' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Created At', data: 'created_at' },
        { title: 'Role', data: 'role' }
    ];

    // RDVs properties
    patients!: Observable<Patient[]>;
    rdvsError: string = '';
    rdvChartID: string = 'rdv-chart';
    rdvChartType: string = 'line';
    rdvPerMonth!: number[];
    rdvLabel: string = 'Rendezvous';
    rdvChartTitle: string = 'Rendezvous per month';
    rdvsCols: TableColumn[] = [
        { title: 'Order', data: 'order' },
        { title: 'Display Name', data: 'displayName' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Created At', data: 'created_at' },
        { title: 'Last Update', data: 'lastUpdate' },
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

    ngAfterViewInit(): void { }

    ngOnDestroy(): void { }

    getUsers() {
        this.users = this.databaseService.getUsersList().pipe(map(actions => {
            let i = 1;
            return actions.map(user => {
                let load = user.payload.doc.data();
                return {
                    ...load,
                    created_at: load.created_at.toDate().toLocaleString(),
                    order: i++
                }
            });
        }));
        // get chart data
        this.databaseService.getUsersList().subscribe(results => {
            let usrMonths = results.map(usr => usr.payload.doc.data().created_at.toDate()
                .toLocaleString('en', { month: 'long' }));

            this.usrsPerMonth = this.months.map(
                month => usrMonths.filter((val: any) => val == month).length);
        })
    }

    // rendezvous methods.
    getPatients() {
        this.patients = this.databaseService.getPatientsList().pipe(map(actions => {
            let i = 1;
            return actions.map(rdv => {
                let load = rdv.payload.doc.data();
                return {
                    rdvID: rdv.payload.doc.id,
                    ...load,
                    created_at: load.created_at.toDate().toLocaleString(),
                    lastUpdate: load.lastUpdate ? load.lastUpdate.toDate().toLocaleString() :
                        'Not updated',
                    order: i++
                }
            })
        }));
        // get chart data
        this.databaseService.getPatientsList().subscribe(results => {
            let rdvMonths = results.map(rdv => rdv.payload.doc.data().created_at.toDate()
                .toLocaleString('en', { month: 'long' }));

            this.rdvPerMonth = this.months.map(
                month => rdvMonths.filter((val: any) => val == month).length);
        })
    }

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

    deleteUserByID(id: string) { }

    onDeletePatient = (data: Patient) => this.databaseService.deletePatient(data);

    onEditUsersBtn() {
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