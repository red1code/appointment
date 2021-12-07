import { Component, OnInit, Input, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TableColumn } from 'src/app/models/tablesCols';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() infos!: any;
    @Input() tableCol!: TableColumn[];
    @ViewChild(DataTableDirective, { static: false })
    dtElement!: DataTableDirective;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['infos']) this.rerenderTable()
    }

    ngOnInit(): void {
        this.dtOptions = {
            data: this.infos,
            multiple: true,
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
        }
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe()
    }

    rerenderTable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Update table infos
            this.dtOptions.data = this.infos;
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });

    }
}
