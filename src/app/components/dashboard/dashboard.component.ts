import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Chart } from 'chart.js';
import { User } from 'src/app/models/user';
import { Observable, Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import * as firebase from 'firebase';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    currentUser!: User;
    users!: any[];
    patients!: any[];
    rdvMonths!: string[];
    rdvPerMonth!: number[];
    dtUsersOptions!: DataTables.Settings;
    dtUsersTrigger: Subject<ADTSettings> = new Subject();
    datePipe = 'MMMM d, y - hh:mm aa';
    dtRdvsOptions!: DataTables.Settings;
    dtRdvsTrigger: Subject<ADTSettings> = new Subject();
    backgroundColor = '#ffffff';
    usrsCols: string[] = ['ID', 'First Name', 'Last Name', 'Email', 'Phone Number',
        'Created At', 'Role'];
    rdvCols: string[] = ['Order', 'Full Name', 'Phone Number', 'Created At',
        'Last Update'];
    months: string[] = Array.from({ length: 12 }, (item, i) => {
        return new Date(0, i).toLocaleString('en', { month: 'long' })
    });
    expChart: any;

    constructor(
        private authService: AuthService,
        private databaseService: DatabaseService,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) {
        this.getUsers();
        this.getPatients();
        this.getCurrentUser();
    }

    ngOnInit(): void {
        this.dtUsersOptions = this.dtTablesSettings();
        this.dtRdvsOptions = this.dtTablesSettings();
    }

    ngAfterViewInit(): void {
        this.dtUsersTrigger.next();
        this.dtRdvsTrigger.next();
    }

    dtTablesSettings() {
        return {
            pagingType: 'full_numbers',
            pageLength: 5,
            lengthMenu: [3, 5, 10, 25, 50, 100],
            dom: 'Bfrtip',
            // Configure the buttons
            buttons: [
                'columnsToggle',
                'colvis',
                // 'copy',
                // 'print',
                'csv',
                'excel',
                // {
                //     text: 'Some button',
                //     key: '1',
                //     action: function (e: any, dt: any, node: any, config: any) {
                //         alert('Button activated');
                //     }
                // }
            ]
        }
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

    getUsers = () => this.angularFirestore.collection('users', ref => {
        return ref.orderBy('created_at')
    }).valueChanges()
        .subscribe(res => {
            this.users = res;
            let i = 1;
            this.users.map(usr => {
                usr.id = i;
                i++;
            })
        })

    onDeleteUser(uid: string) {
        //     firebase.auth
    }

    // rendezvous methods.
    getPatients() {
        this.databaseService.getPatientsList().subscribe(res => {
            // in order to get rid of "payload.doc.data()" I added these steps:
            let results = res;
            this.patients = results.map((patient: any) => {
                return {
                    id: patient.payload.doc.data().order,
                    fullName: patient.payload.doc.data().fullName,
                    phoneNumber: patient.payload.doc.data().phoneNumber,
                    created_at: patient.payload.doc.data().created_at,
                    lastUpdate: patient.payload.doc.data().lastUpdate,
                    rdvID: patient.payload.doc.id
                }
            });
            let i = 1;
            this.patients.map(rdv => {
                rdv.id = i;
                i++;
            })
            // making an array of number of rendezvous in every month:
            this.rdvMonths = results.map((p: any) => {
                return p.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });
            this.rdvPerMonth = this.months.map(
                month => this.rdvMonths.filter(val => val == month).length);
            // after we got rdvPerMonth array, now we call chart.js:
            this.chart();
        })
    }

    emptyRdvList = () => (this.patients.length === 0) ? true : false;

    onDeletePatient = (data: any) => this.databaseService.deletePatient(data);

    // chartJS method.
    chart() {
        var myChart: any = new Chart("myChart", {
            type: 'line',
            data: {
                labels: this.months,
                datasets: [{
                    label: 'Rendezvous',
                    data: this.rdvPerMonth, // [4, 3, 5, 11, 25, 50, 75, 40, 29, 60, 88, 121],
                    backgroundColor: ['rgba(255, 145, 0, 0.9)'],
                    borderColor: ['rgba(30, 0, 255, 0.9)'],
                    borderWidth: 1.5
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

    // exporting chart.
    chartToImg() {
        let canvas = document.getElementById('myChart') as HTMLCanvasElement;
        let destinationCanvas = document.createElement("canvas");
        destinationCanvas.width = canvas.width;
        destinationCanvas.height = canvas.height;
        let destCtx: CanvasRenderingContext2D | null = destinationCanvas.getContext('2d');
        //create a rectangle with the desired color
        destCtx!.fillStyle = this.backgroundColor;
        destCtx?.fillRect(0, 0, canvas.width, canvas.height);
        //draw the original canvas onto the destination canvas
        destCtx?.drawImage(canvas, 0, 0);
        //finally use the destinationCanvas.toDataURL() method to get the desired output;
        let a = document.createElement('a');
        a.href = destinationCanvas.toDataURL()
        a.download = this.expChart.options.title.text;
        a.click();
    }

    adminPermission = () => (this.currentUser.role === 'admin') ? true : false;

    editorPermission = () => (this.currentUser.role === 'editor') ? true : false;

    analystPermission = () => (this.currentUser.role === 'analyst') ? true : false;

}

// THE END.



/*

'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(25, 134, 84, 1)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',

'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(54, 162, 235, 1)',
'rgba(230, 45, 45, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',


let results = res;
this.users = results.map((user: any) => {
    return {
        ID: user.payload.doc.data().id,
        First_Name: user.payload.doc.data().firstName,
        Family_Name: user.payload.doc.data().familyName,
        Email: user.payload.doc.data().email,
        Phone_Number: user.payload.doc.data().phoneNumber,
        Role: user.payload.doc.data().role,
        Created_At: user.payload.doc.data().created_at,
        UID: user.payload.doc.id
    }
})

*/