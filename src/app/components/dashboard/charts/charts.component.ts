import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

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
    @Input() chartID!: string;
    @Input() chartType!: string;

    backgroundColor = '#ffffff';
    expChart: any;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['yAxis']) {
            this.loadChart()
        }
    }

    ngOnInit(): void {
        this.loadChart();
    }

    ngAfterViewInit(): void {
        this.loadChart()
    }

    loadChart() {
        const myChart = new Chart(this.chartID, {
            type: this.chartType,
            data: {
                labels: this.xAxis,
                datasets: [{
                    label: this.lbl,
                    data: this.yAxis,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
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
                        'rgba(255, 159, 64, 1)',
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
                scales: { },
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
        const canvas = document.getElementById(this.chartID) as HTMLCanvasElement;
        const destinationCanvas = document.createElement("canvas");
        destinationCanvas.width = canvas.width;
        destinationCanvas.height = canvas.height;
        const destCtx: CanvasRenderingContext2D | null = destinationCanvas.getContext('2d');
        //create a rectangle with the desired color
        destCtx!.fillStyle = this.backgroundColor;
        destCtx?.fillRect(0, 0, canvas.width, canvas.height);
        //draw the original canvas onto the destination canvas
        destCtx?.drawImage(canvas, 0, 0);
        //finally use the destinationCanvas.toDataURL() method to get the desired output;
        const a = document.createElement('a');
        a.href = destinationCanvas.toDataURL();
        a.download = this.expChart.options.title.text;
        a.click();
    }

}

// THE END.