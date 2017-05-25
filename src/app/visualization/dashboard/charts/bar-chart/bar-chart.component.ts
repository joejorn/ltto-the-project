import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ltto-bar-chart',
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

export class BarChartComponent implements OnChanges {

    @Input() labels: string[] = [];
    @Input() values: number[] = [];

    private chartData: any;
    private chartLayout: any;
    private chartOptions: any;

    constructor() {

        let colorPalette = [
            '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', 
            '#9966ff', '#ff9f40', '#ccff66', '#ff66cc'
        ];

        this.chartData = [
			{
				x: this.labels,
				y: this.values,
				marker: {
					color: colorPalette
				},
				type: 'bar',
                hoverinfo: "x+y"
			}
		];

		this.chartLayout = {
			margin: { t: 40, r: 20, b: 40, l: 40 },
            bargap: 0.55,
            hovermode: "closest",
			showlegend: false,
			yaxis: {
				gridwidth: 2
			},
			xaxis: {
                ticklen	:	5,
                tickwidth	:	1,
                ticks	:	"outside"
			}
		}

		this.chartOptions =  {displayModeBar: false}
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            // console.log(`"${propName}"-value changed: "${change.previousValue}" -> "${change.currentValue}"`);

            if (propName === 'values') {
                this.chartData[0].y = change.currentValue;
            } else if (propName === 'labels') {
                this.chartData[0].x = change.currentValue;
            }
            
        }
    }

}