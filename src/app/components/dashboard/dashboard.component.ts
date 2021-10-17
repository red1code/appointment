import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    users: any;
    usrsCols: any[];
    patients!: any[];
    rdvCols: any[];
    months: string[];
    rdvMonths!: string[];
    rdvPerMonth!: number[];
    shit!: any;
    expChart: any;

    constructor(
        private authService: AuthService,
        private databaseService: DatabaseService
    ) {
        this.months = Array.from({ length: 12 }, (item, i) => {
            return new Date(0, i).toLocaleString('en', { month: 'long' })
        });
        this.rdvCols = [
            { field: 'fullName', header: 'Full Name' },
            { field: 'phoneNumber', header: 'Phone Number' },
            { field: 'created_at', header: 'Created at' },
            { field: 'lastUpdate', header: 'Last update' }
        ];
        this.usrsCols = [
            { field: 'firstName', header: 'First Name' },
            { field: 'familyName', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'phoneNumber', header: 'Phone Number' },
            { field: 'created_at', header: 'Created at' }
        ];
    }

    ngOnInit(): void {
        this.getUsers();
        this.getPatients();
    }

    // users methods.
    getUsers() {
        return this.databaseService.getUsersList().subscribe(res => {
            // in order to get rid of "payload.doc.data()" I added these steps:
            let results = res;
            this.users = results.map((user: any) => {
                return {
                    firstName: user.payload.doc.data().firstName,
                    familyName: user.payload.doc.data().familyName,
                    email: user.payload.doc.data().email,
                    phoneNumber: user.payload.doc.data().phoneNumber,
                    created_at: user.payload.doc.data().created_at
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
                    lastUpdate: patient.payload.doc.data().lastUpdate
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
        let header: string[] = [];
        this.usrsCols.forEach(c => {
            header.push(c.header)
        });
        this.downloadCSV(this.users, 'users-list', header);
    }

    // exporting rdv list.
    rdvListToCSV() {
        let header: string[] = [];
        this.rdvCols.forEach(c => {
            header.push(c.header)
        });
        this.downloadCSV(this.patients, 'rdv-list', header);
    }

    downloadCSV(result: any, fileName: string, header: any) {
        const csvData = this.convertToCSV(result, header);
        const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8' });
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.setAttribute('download', fileName + '.csv');
        downloadLink.style.visibility = 'hidden';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    convertToCSV(objArray: any, headerList: any) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let row = 'S.No,';
        for (let i in headerList) {
            row += headerList[i] + ','
        }
        row = row.slice(0, -1);
        str = row + '\r\n';
        for (let i = 0; i < array.length; i++) {
            let line = (i + 1) + '';
            for (let index in headerList) {
                const head = headerList[index];
                line += ',' + array[i][head];
            }
            str += line + '\r\n';
        }
        return str;
    }

    // exporting chart.
    chartToPNG() {
        let canvas = document.getElementById('myChart') as HTMLCanvasElement;
        // canvas.style.backgroundColor = '#fff'
        let dataURL = canvas.toDataURL("image/jpeg");
        let fName = this.expChart.options.title.text + '.jpeg';
        this.downloadFile(dataURL, fName);
    }

    downloadFile(data: any, filename: any) {
        let a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }

}

// THE END.



/*
patient.payload.doc.data().fullName
*/