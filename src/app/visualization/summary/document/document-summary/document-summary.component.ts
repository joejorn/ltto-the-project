import { AfterViewInit, Component, Input, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { PriceListComponent } from '../../../shared/components/price-list/price-list.component';
import { VisualizationDataService } from '../../../shared/services/visualization-data.service';

@Component({
    selector: 'ltto-document-summary',
    templateUrl: 'document-summary.component.html',
    styleUrls: ['document-summary.component.css']
})

export class DocumentSummaryComponent implements AfterViewInit, OnInit {

    private selected: any;
    @Input() documents: any[];
    @Input() priceList: any[];  // @TODO: remove this
    priceCategories: any[];

    @ViewChild(MdSidenav) sideNav: MdSidenav;
    @ViewChild(PriceListComponent) menuList: PriceListComponent;

    
    constructor(private _ngZone: NgZone, private route: ActivatedRoute, private dataService: VisualizationDataService) {
        this.documents = [];
        this.priceList = [];
    }

    ngOnInit() {
        this.route.data.subscribe(
            (data: { documents: any[], prices: any[], priceCategories: any[] }) => {
                this.documents = data.documents
                this.priceList = data.prices;   // @TODO: remove this
                this.priceCategories = data.priceCategories;
                console.log('price categories: ', data.priceCategories);
            }
        );
    }

    ngAfterViewInit(): void {
        this.menuList.selectedIndex = 0;
        /*if (this.sideNav) {
            window.onresize = (e) => this._ngZone.run( () => this.initSideBar() );
            this._ngZone.run( () => this.initSideBar() );
        }*/
	}

    /*private initSideBar(): void {
		if (window.innerWidth > 768) {
			this.sideNav.open();
		} else {
			this.sideNav.close();
		}
	}*/

    private onSelectedChange( o: any ) {
        // this.selected = o;

        this.dataService.getDetailDocument(o.uid).first()
            .subscribe(
                doc => { 
                    this.selected = doc; 
                }
            )
        
        
    }

}