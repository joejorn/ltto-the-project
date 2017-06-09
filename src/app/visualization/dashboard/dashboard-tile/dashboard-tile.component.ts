import { Component, Input } from '@angular/core';

@Component({
    selector: 'ltto-dashboard-tile',
    templateUrl: './dashboard-tile.component.html',
    styleUrls: ['./dashboard-tile.component.css']
})

export class DashboardTileComponent  {

    @Input() title: string;
    
    @Input() showFooter:boolean;

    constructor(){
        this.showFooter = false;
    }
    
}