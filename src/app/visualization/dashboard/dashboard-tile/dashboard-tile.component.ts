import { AfterContentInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'ltto-dashboard-tile',
    templateUrl: './dashboard-tile.component.html',
    styleUrls: ['./dashboard-tile.component.css']
})

export class DashboardTileComponent implements AfterContentInit {

    @Input() title: string;
    @ViewChild('tileFooter') private footer:ElementRef;

    private showFooter:boolean = false;

    ngAfterContentInit() {
        this.showFooter = this.footer.nativeElement.children.length > 0;
    }
    
}