import { Component, OnInit, Input, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { TableColumn } from 'src/app/models/tablesCols';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() infos!: Observable<any>;
    @Input() tableCol!: TableColumn[];

    dtOptions: any; //DataTables.Settings = {};
    dtTrigger: Subject<ADTSettings> = new Subject();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['infos']) {
            this.dtTrigger.next();
        }
    }

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
        this.dtTrigger.unsubscribe()
    }

}
