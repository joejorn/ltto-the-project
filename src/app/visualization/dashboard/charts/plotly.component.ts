import { AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';

declare var Plotly: any;

@Component({
    selector: 'ltto-plotly-chart',
    template: 
    `
        <div class="chart-container">
            <div #chartWrapper class="chart-wrapper">
                <!-- Plotly chart will be drawn inside this DIV -->
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }
            .chart-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: inherit;
            }
            .chart-wrapper {
                width: 90%;
                height: 90%;
                margin: auto;
            }
        `
    ]
})

export class PlotlyComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() data: any;
    @Input() layout: any;
    @Input() options: any;

    @ViewChild( 'chartWrapper' ) chartWrapper: ElementRef;

    private resizeListener: any;

    ngOnInit() {
        // callback on window resizing
        this.resizeListener = () => { 
            Plotly.Plots.resize(this.chartWrapper.nativeElement);
        };
    }

    ngAfterViewInit() {

        let elem = this.chartWrapper.nativeElement;
        Plotly.newPlot( elem, this.data, this.layout, this.options );
        this.resizeListener();

        // add callback to resizing
        window.addEventListener('resize', this.resizeListener );
    }

    ngOnDestroy() {
        // remove callback
        window.removeEventListener('resize', this.resizeListener );
    }

}