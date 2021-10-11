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
    days!: any;

    constructor(
        private databaseService: DatabaseService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getUsers();
        this.getPatients();
        // this.getPDays();
        this.chart();
    }

    // users methods
    getUsers() {
        return this.databaseService.getUsersList().subscribe(res => {
            this.users = res;
        })
    }

    onDeleteUser() {
        if (confirm("Are you sure that you want to delete that user ?"))
            this.authService.deleteUser();
    }

    // rendezvous methods
    getPatients() {
        return this.databaseService.getPatientsList().subscribe(res => {
            this.patients = res;
        })
    }

    onDeletePatient = (data: any) => this.databaseService.deletePatient(data);

    getPDays() {
        let date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        this.days = new Date(year, month, 0).getDate();
        // this.patients.map((p:any) => {
        //     this.days = this.days.push(p.payload.doc.data().created_at)
        // })
    }

    // chart.js
    chart() {
        var myChart: any = new Chart("myChart", {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'Avril', 'May', 'June', 'July', 'Out', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: 'Rendezvous',
                    data: [4, 3, 5, 11, 25, 50, 75, 40, 29, 60, 88, 121 ],
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
                title:{
                    display: true,
                    text: 'Number of rendezvous in every month',
                    fontSize: 25
                }
            }
        });
    }

}

// THE END.