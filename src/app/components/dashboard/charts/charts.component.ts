import { Component, Input, OnInit, AfterViewInit, Output, OnChanges, SimpleChanges } from '@angular/core';
// import * as Chart from 'chart.js';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() xAxis!: string[];
    @Input() yAxis!: number[];
    @Input() title!: string;
    @Input() lbl!: string;

    backgroundColor = '#ffffff';
    expChart: any;
    changingDT!: Observable<number[]>;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['yAxis']) {
            this.chart();
        }
    }

    ngOnInit(): void {
        this.chart();
        // setInterval(() => {
        //     this.chart();
        // }, 5000);
        // this.yAxis.subscribe()
    }

    ngAfterViewInit(): void { }

    chart() {
        var myChart: Chart = new Chart("myChart", {
            type: 'line',
            data: {
                labels: this.xAxis,
                datasets: [{
                    label: this.lbl,
                    data: this.yAxis,
                    backgroundColor: ['rgba(255, 145, 0, 0.9)'],
                    borderColor: ['rgba(30, 0, 255, 0.9)'],
                    borderWidth: 1.5
                }]
            },
            options: {
                scales: {},
                title: {
                    display: true,
                    text: this.title,
                    fontSize: 25
                }
            }
        });
        this.expChart = myChart;
    }

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
        a.href = destinationCanvas.toDataURL();
        a.download = this.expChart.options.title.text;
        a.click();
    }

}
