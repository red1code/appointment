import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TableColumn } from 'src/app/models/tablesCols';
import { AngularFireAuth } from '@angular/fire/auth';
import { Patient } from 'src/app/models/patient';
import { User } from 'src/app/models/user';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    currentUser!: User;
    
    users!: any; //Observable<User[]>;
    patients!: any; // Observable<Patient[]>;

    canEditUsrs: boolean = false;

    rdvsError: string = '';
    usrsError: string = '';

    usrsPerMonth!: number[];
    rdvPerMonth!: number[];

    usrsLabel: string = 'User';
    rdvLabel: string = 'Rendezvous';

    usrsChartTitle: string = 'Users per month'
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
        { title: 'Order', data: 'order' },
        { title: 'Display Name', data: 'displayName' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Created At', data: 'created_at' },
        { title: 'Last Update', data: 'lastUpdate' },
        // { title: 'RDV ID', data: 'rdvID' }
    ];

    dtOptions: any;
    dtTrigger: Subject<ADTSettings> = new Subject();

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

    ngOnInit(): void {
        this.dtOptions = {
            data: this.patients,
            columns: this.rdvsCols,
            pagingType: 'full_numbers',
            pageLength: 5,
            // lengthMenu: [3, 5, 10, 25, 50, 100],
            dom: 'Bfrtip',
            // Configure the buttons
            buttons: [
                // 'columnsToggle',
                'colvis',
                // 'copy',
                // 'print',
                'csv',
                'excel',
            ]
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
        
    }

    ngOnDestroy(): void {
        // this.dtTrigger.unsubscribe();
    }

    getUsers() {
        this.databaseService.getUsersList().subscribe((results: any) => {
            let i = 1;
            this.users = results.map((user: any) => {
                let load = user.payload.doc.data()
                return {
                    // id: user.payload.doc.id,
                    ...load,
                    created_at: load.created_at.toDate().toLocaleString(),
                    order: i++,
                }
            });
            let usrMonths = results.map((m: any) => {
                return m.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });
            this.usrsPerMonth = this.months.map(month => {
                return usrMonths.filter((val: any) => val == month).length
            });
        }, error => { this.usrsError = error })
    }

    // rendezvous methods.
    getPatients() {
        this.databaseService.getPatientsList().subscribe((results: any) => {
            let i = 1;
            this.patients = results.map((rdv: any) => {
                let load = rdv.payload.doc.data();
                return {
                    rdvID: rdv.payload.doc.id,
                    ...load,
                    created_at: load.created_at.toDate().toLocaleString(),
                    lastUpdate: (load.lastUpdate !== 'Not updated') ?
                        load.lastUpdate.toDate().toLocaleString() :
                        load.lastUpdate,
                    order: i++,
                }
            });
            this.dtTrigger.next();
            // making an array of numbers of rendezvous in every month:
            let rdvMonths = results.map((rdv: any) => {
                return rdv.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });
            this.rdvPerMonth = this.months.map(month => {
                return rdvMonths.filter((val: any) => val == month).length
            });
            this.chart();
        }, error => { this.rdvsError = error })
    }
    chart() {
        var myChart: Chart = new Chart("myChart2", {
            type: 'line',
            data: {
                labels: this.months,
                datasets: [{
                    label: 'rdvs',
                    data: this.rdvPerMonth,
                    backgroundColor: ['rgba(255, 145, 0, 0.9)'],
                    borderColor: ['rgba(30, 0, 255, 0.9)'],
                    borderWidth: 1.5
                }]
            },
            options: {
                scales: {},
                title: {
                    display: true,
                    text: this.rdvChartTitle,
                    fontSize: 25
                }
            }
        });
        // this.expChart = myChart;
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

.pipe(map(data => {
    let i = 1;
    return data.map((rdv: any) => {
        return {
            rdvID: rdv.payload.doc.id,
            ...rdv.payload.doc.data(),
            created_at: rdv.payload.doc.data().created_at.toDate().toLocaleString(),
            lastUpdate: (rdv.payload.doc.data().lastUpdate !== 'Not updated') ?
                rdv.payload.doc.data().lastUpdate.toDate().toLocaleString() :
                rdv.payload.doc.data().lastUpdate,
            order: i++,
        }
    })
}))

*/