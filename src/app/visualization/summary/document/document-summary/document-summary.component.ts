import { AfterViewInit, Component, Input, OnInit, NgZone, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { PriceListComponent } from '../../../shared/components/price-list/price-list.component';
import { VisualizationDataService } from '../../../shared/services/visualization-data.service';

@Component({
    selector: 'ltto-document-summary',
    templateUrl: 'document-summary.component.html',
    styleUrls: [
        'document-summary.component.css', 
        '../../../../shared-module/styles/fab.style.css'
    ]
})

export class DocumentSummaryComponent implements AfterViewInit, OnInit {

    private selected: any;
    private compactMode: boolean;

    @Input() documents: any[];
    priceCategories: any[];

    @ViewChild(MdSidenav) sideNav: MdSidenav;
    @ViewChild(PriceListComponent) menuList: PriceListComponent;

    
    constructor(
        private dataService: VisualizationDataService,
        private _ngZone: NgZone
    ) {
        this.documents = [];
    }

    ngOnInit() {
        this.documents = [];
        this.priceCategories = [];

        Observable.forkJoin(
            this.dataService.getDetailedPriceCategories().first(),
            this.dataService.getDocuments().first()
        ).subscribe(
            values => {
                this.priceCategories = values[0];
                this.documents = values[1];
            }
        )
    }

    ngAfterViewInit(): void {
        if (this.sideNav) {
            window.onresize = (e) => this._ngZone.run( () => this.initSideBar() );
        }
        this._ngZone.run( () => this.initSideBar() );
	}

    private initSideBar(): void {
		if (window.innerWidth > 700) {
            this.compactMode = false;
			this.sideNav.open();
		} else {
            this.compactMode = true;
			this.sideNav.close();
		}
	}

    private onSelectedChange( o: any ) {

        if (!o) {
            return;
        } else {
            // retrive detailed document
            this.dataService.getDetailDocument(o.uid).first()
                .subscribe(
                    doc => { 
                        this.selected = doc; 
                        if (this.compactMode) {
                            this.sideNav.close();
                        }
                    }
                )
        }

        
        
    }

}