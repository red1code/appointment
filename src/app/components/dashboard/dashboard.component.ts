import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Chart } from 'chart.js';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    currentUser: any;
    users: any;
    usrsCols: any[];
    patients!: any[];
    rdvCols: any[];
    months: string[];
    rdvMonths!: string[];
    rdvPerMonth!: number[];
    expChart: any;
    datePipe = 'MMMM d, y - hh:mm aa';

    constructor(
        private authService: AuthService,
        private databaseService: DatabaseService,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) {
        this.months = Array.from({ length: 12 }, (item, i) => {
            return new Date(0, i).toLocaleString('en', { month: 'long' })
        });
        this.usrsCols = [
            { field: 'firstName', header: 'First Name' },
            { field: 'familyName', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'phoneNumber', header: 'Phone Number' },
            { field: 'created_at', header: 'Created at' },
            { field: 'roles', header: 'Role' }
        ];
        this.rdvCols = [
            { field: 'fullName', header: 'Full Name' },
            { field: 'phoneNumber', header: 'Phone Number' },
            { field: 'created_at', header: 'Created at' },
            { field: 'lastUpdate', header: 'Last update' }
        ];
    }

    ngOnInit(): void {
        this.getUsers();
        this.getPatients();
        this.getCurrentUser();
        // this.currentUser = this.authService.getCurrentUser();
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

    // users methods.
    getUsers() {
        return this.databaseService.getUsersList().subscribe(res => {
            // in order to get rid of "payload.doc.data()", I added these steps:
            let results = res;
            this.users = results.map((user: any) => {
                return {
                    firstName: user.payload.doc.data().firstName,
                    familyName: user.payload.doc.data().familyName,
                    email: user.payload.doc.data().email,
                    phoneNumber: user.payload.doc.data().phoneNumber,
                    role: user.payload.doc.data().role,
                    created_at: user.payload.doc.data().created_at.toDate(),
                    id: user.payload.doc.id
                }
            })
        })
    }

    onDeleteUser() { }

    // rendezvous methods.
    getPatients() {
        return this.databaseService.getPatientsList().subscribe(res => {
            // in order to get rid of "payload.doc.data()" I added these steps:
            let results = res;
            this.patients = results.map((patient: any) => {
                return {
                    fullName: patient.payload.doc.data().fullName,
                    phoneNumber: patient.payload.doc.data().phoneNumber,
                    created_at: patient.payload.doc.data().created_at,
                    lastUpdate: patient.payload.doc.data().lastUpdate,
                    id: patient.payload.doc.id
                }
            })
            // make an array of rendezvous in every month.
            this.rdvMonths = results.map((p: any) => {
                return p.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });
            this.rdvPerMonth = this.months.map(month => this.rdvMonths.filter(val => val == month).length);
            /* chart methode must be called here 
               because we must get rdvPerMonth array first. */
            this.chart();
        })
    }

    emptyRdvList = () => (this.patients.length === 0) ? true : false;

    onDeletePatient = (data: any) => this.databaseService.deletePatient(data);

    // chartJS method.
    chart() {
        var myChart: any = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: this.months,
                datasets: [{
                    label: 'Rendezvous',
                    data: this.rdvPerMonth, // [4, 3, 5, 11, 25, 50, 75, 40, 29, 60, 88, 121],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {},
                title: {
                    display: true,
                    text: 'Rendezvous per month',
                    fontSize: 25
                }
            }
        });
        this.expChart = myChart;
    }

    // exporting usr list to csv file.
    usrListToCSV() {
        this.databaseService.exportToCsv('users-list', this.users);
    }

    // exporting rdv list.
    rdvListToCSV() {
        this.databaseService.exportToCsv('rdv-list', this.patients);
    }

    // exporting chart.
    chartToPNG() {
        let canvas = document.getElementById('myChart') as HTMLCanvasElement;
        canvas.style.backgroundColor = '#fff'
        let dataURL = canvas.toDataURL();
        let fName = this.expChart.options.title.text;
        this.downloadFile(dataURL, fName);
    }

    downloadFile(data: any, filename: any) {
        let a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }

    adminPermission = () => (this.currentUser.role === 'admin') ? true : false;

    editorPermission = () => (this.currentUser.role === 'editor') ? true : false;

    analystPermission = () => (this.currentUser.role === 'analyst') ? true : false;

}

// THE END.
