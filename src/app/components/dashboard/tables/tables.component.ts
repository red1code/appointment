import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() infos: any[] = [];
    @Input() tableHeader!: string[];

    dtOptions: any// DataTables.Settings = {};
    dtTrigger: Subject<ADTSettings> = new Subject();
    data: any;

    constructor() { }

    ngOnInit(): void {
        this.dtOptions = {
            // data: this.data,
            // columns: [
            //     { title: 'Order', data: 'order' },
            //     { title: 'First name', data: 'firstName' },
            //     { title: 'Last name', data: 'familyName' },
            //     { title: 'Email', data: 'email' },
            //     { title: 'Phone Number', data: 'phoneNumber' },
            //     { title: 'Created At', data: 'created_at' },
            //     { title: 'role', data: 'role' }
            // ],
            pagingType: 'full_numbers',
            pageLength: 4,
            // lengthMenu: [3, 5, 10, 25, 50, 100],
            // dom: 'Bfrtip',
            // Configure the buttons
            // buttons: [
            //     'columnsToggle',
            //     'colvis',
            //     // 'copy',
            //     // 'print',
            //     'csv',
            //     'excel',
            //     // {
            //     //     text: 'Some button',
            //     //     key: '1',
            //     //     action: function (e: any, dt: any, node: any, config: any) {
            //     //         alert('Button activated');
            //     //     }
            //     // }
            // ]
        };
        this.initialData();
    }

    ngAfterViewInit(): void {
        if (this.infos.length !== 0) this.dtTrigger.next();
    }
    
    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe()
    }

    initialData() {
        this.data = this.infos;
        this.dtTrigger.next();
    }

    tableSettings() {
        return {
            // data: this.data,
            // columns: [
            //     { title: 'Order', data: 'order' },
            //     { title: 'First name', data: 'firstName' },
            //     { title: 'Last name', data: 'familyName' },
            //     { title: 'Email', data: 'email' },
            //     { title: 'Phone Number', data: 'phoneNumber' },
            //     { title: 'Created At', data: 'created_at' },
            //     { title: 'role', data: 'role' }
            // ],
            pagingType: 'full_numbers',
            pageLength: 4,
            // lengthMenu: [3, 5, 10, 25, 50, 100],
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

}
