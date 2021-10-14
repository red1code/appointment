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
    patients!: any[];
    months: string[];
    rdvMonths!: string[];
    rdvPerMonth!: number[];
    shit!: any;

    constructor(
        private authService: AuthService,
        private databaseService: DatabaseService
    ) {
        this.months = Array.from({ length: 12 }, (item, i) => {
            return new Date(0, i).toLocaleString('en', { month: 'long' })
        });
    }

    ngOnInit(): void {
        this.getUsers();
        this.getPatients();
    }

    // users methods.
    getUsers() {
        return this.databaseService.getUsersList().subscribe(res => {
            this.users = res;
        })
    }

    onDeleteUser() {
        if (confirm("Are you sure that you want to delete that user ?"))
            this.authService.deleteUser();
    }

    // rendezvous methods.
    getPatients() {
        return this.databaseService.getPatientsList().subscribe(res => {
            // get an array of patients's rendezvous.
            this.patients = res;
            // get an array of months that has rendezvous.
            this.rdvMonths = this.patients.map(p => {
                return p.payload.doc.data().created_at.toDate()
                    .toLocaleString('en', { month: 'long' });
            });

            // make an array of rendezvous in every month.
            // this.rdvPerMonth = this.months.map(month => {
            //     return this.rdvMonths.reduce(
            //         (previousValue: number, currentValue: string) => {
            //             return currentValue == month ? ++previousValue : previousValue;
            //         }, 0)
            // })

            this.rdvPerMonth =this.months.map(month => this.rdvMonths.filter(val =>val == month).length)

            this.shit = 


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
                    text: 'Number of rendezvous in every month',
                    fontSize: 25
                }
            }
        });
    }

}

// THE END.