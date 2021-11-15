import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { TableColumn } from 'src/app/models/tablesCols';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() infos: any[] = [];
    @Input() tableCol!: TableColumn[];
    @Input() dtTrigger:  Subject<any> = new Subject<any>();

    dtOptions: any// DataTables.Settings = {};
    // dtTrigger!: Subject<ADTSettings> = new Subject();

    constructor() { }

    ngOnInit(): void {
        this.dtOptions = {
            data: this.infos,
            columns: this.tableCol,
            pagingType: 'full_numbers',
            pageLength: 5,
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
            ]
        };
    }

    ngAfterViewInit(): void {
        // this.dtTrigger.next();
    }
    
    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe()
    }

}
