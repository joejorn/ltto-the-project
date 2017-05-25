import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ltto-pie-chart',
    template: 
    `
        <ltto-plotly-chart 
            [data]="chartData" 
            [layout]="chartLayout"
            [options]="chartOptions">
        </ltto-plotly-chart>
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }
        `
    ]
})

export class PieChartComponent implements OnChanges {

    @Input() labels: string[] = [];
    @Input() values: number[] = [];

    private chartData: any;
    private chartLayout: any;
    private chartOptions: any;

    constructor() {

        // Flat Color Palette
        let colorPalette = [
            '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', 
            '#9966ff', '#ff9f40', '#ccff66', '#ff66cc'
        ];

        /*
        // Material
        let colorPalette = [
            "#2196F3", "#F44336", "#009688", "#FFEB3B", "#673AB7", 
            "#00BCD4", "#E91E63", "#4CAF50", "#FFC107", "#9C27B0", 
            "#03A9F4", "#3F51B5", "#FF9800", "#8BC34A", "#FF5722", 
            "#CDDC39", "#795548"
        ];
        */

        this.chartData = [
			{
				values: this.labels,
				labels: this.values,
				type: 'pie',
				pull: 0.02,
				insidetextfont: {
					size: 12,
					color: '#fff'
				},
                marker: {
                    colors: colorPalette
                }
			}
		];

		this.chartLayout = {
			showlegend: true,
			legend: {
                orientation: "h"
            },
			// height: 220,
			// width: 220,
			margin: {
				t: 20,
				r: 20,
				b: 20,
				l: 20
			},
		};

		this.chartOptions =  {
            displayModeBar: false,
            staticPlot: true
        }

        // console.log('[PIE] data has been initialized');
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            this.chartData[0][propName] = change.currentValue;
            // console.log(`"${propName}"-value changed: "${change.previousValue}" -> "${change.currentValue}"`);
        }
    }

}