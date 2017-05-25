import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ltto-metric-chart',
    template: 
    `
        <div class="metric-wrapper">
            <div class="metric-head">{{title}}</div>
            <div class="metric-content"
                [class.colorized]="enableNegative"
                [class.negative]="amount < 0">
                <div *ngIf="enableNegative && (amount > 0)" class="metric-prefix">+</div>
                <div class="metric-value">{{amount.toLocaleString("thai")}}</div>
                <div *ngIf="displayCurrency" class="metric-postfix">฿</div>
            </div>
            <div class="metric-foot">{{subtitle}}</div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }
            .metric-wrapper {
                height: 100%;
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            .metric-head {
                text-transform: capitalize;
            }
            .metric-content {
                padding: 12px 0;
                display: flex;
            }
            .metric-content.colorized {
                color: #4CAF50;
            }
            .metric-content.colorized.negative {
                color: red;
            }
            .metric-content .metric-prefix {
                padding-right: 4px;
            }
            .metric-content .metric-value {
                font-size: 28px;
            }
            .metric-content .metric-postfix {
                padding-left: 4px;
            }
            .metric-foot {
                text-transform: uppercase;
            }
        `
    ]
})

export class MetricChartComponent {

    @Input() title: string;
    @Input() subtitle: string;
    @Input() amount: number;

    @Input() displayCurrency: boolean;
    @Input() enableNegative: boolean;

    constructor() {
        this.amount = 0;
    }
    
}