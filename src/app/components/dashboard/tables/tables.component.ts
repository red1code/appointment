import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() dataOptions: DataTables.Settings = {};
    @Input() dataTrigger: Subject<ADTSettings> = new Subject();

    constructor() { }

    ngOnInit(): void {
        this.dataOptions;
        // this.dataTrigger.next();
    }

    ngAfterViewInit(): void {
        // this.dataTrigger.next();
    }
    
    ngOnDestroy(): void {
        // this.dataTrigger.unsubscribe()
    }

}
