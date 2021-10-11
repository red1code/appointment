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
    patients: any;

    constructor(
        private databaseService: DatabaseService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getUsers();
        this.getPatients();
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

    // chart.js
    chart() {
        var myChart: any = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 8, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    // y: {
                    //     beginAtZero: true
                    // }
                }
            }
        });
    }

}

// THE END.