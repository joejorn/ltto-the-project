import { Component, Input, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Dialog
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { PriceListDialog } from '../../shared/components/dialog/price-list-dialog/price-list.dialog';

// Components
import { VisualizationFnService } from '../../shared/services/visualization-fn.service';
import { VisualizationDataService } from '../../shared/services/visualization-data.service';

// Interface
import { IDetailedDocument } from '../../shared/interfaces/detail-document.interface';

@Component({
  	moduleId: module.id,
  	selector: 'ltto-dashboard',
  	templateUrl: 'dashboard.component.html',
  	styleUrls: [
		  'dashboard.component.css', 
		  '../../../shared-module/styles/pre-loader.style.css'
	]
})

export class DashboardComponent implements OnInit, AfterViewInit {

	private MAX_LIST_SIZE: number = 5;	// constant

	// statements
	private loading: boolean;	// component's state
	private compactMode: boolean;
	private activeTopPrice: any;	// buttons state

	// component's input
	priceList: any[];
	priceCategories: any[];
	documents: any[];

	// private counters: any;

	// calculated
	private priceSum: any[];
	private categorySum: any[];
	private lastSums: any;
	
	private uniqueEntries: any[];


	constructor( 
		private fnService: VisualizationFnService, 
		private dataService: VisualizationDataService,
		private dialog: MdDialog,
		private _ngZone: NgZone
	){
		this.loading = true;

		this.documents = [];
		this.priceList = [];
		this.priceCategories = [];

		this.lastSums = {};
		
		this.processDocuments();
	}

    ngOnInit() {

		// categories
		Observable.forkJoin(
			this.dataService.getDetailedPriceCategories().first(),
			this.dataService.getDetailDocuments().first()
		).subscribe(
			values => {
				let categories = values[0];
				this.priceCategories = categories;
				this.priceList = categories.reduce(
					(a,b) => a.concat( b.prices ? b.prices:[]), []
				)

				this.documents = values[1]; 
				this.processDocuments();
				setTimeout(() => {
					this.loading = false;
				}, 500);
			}
		)

    }

	ngAfterViewInit(): void {
		window.onresize = (e) => this.checkDisplaySize();
		this.checkDisplaySize();
	}

    private checkDisplaySize(): void {
		this._ngZone.run( () => {
			this.compactMode = (window.innerWidth < 700);
		} );
	}

	// assign sum price value to price list
	private refreshPrices(prices: any[]): void {
		this.priceCategories.forEach(
			category => {
				category.prices = prices.filter( price => price.categoryId === category.uid );
			}
		)
	}

	// counter for number of documents, sheets, and entries
	private runCounter( categorySum: any[] ): any {
		let counter = {};

		counter['documents'] = this.documents.length;

		let shLen = 0;
		if (this.documents) {
			shLen = this.documents.reduce( 
						(prev, doc) => { 
							let len = doc._sheets ? doc._sheets.length : 0;
							return prev + len;
						}, 0
					);
		}
		counter['sheets'] =  shLen;

		let _entries = [].concat( this.documents.map( (doc) => doc._entries ? doc._entries:[] ) );
		counter['entries'] = _entries.length;

		return counter;
	}

	// calculate required values
	private processDocuments(): void {

		this.activeTopPrice = this.priceList[0];

		// Merge entries of all documents into one single array
		let _entries = [].concat( ...this.documents.map( (doc) => doc._entries ? doc._entries:[] ) );

		this.priceSum = this.fnService.getSumByPrice( this.priceList, _entries );
		this.refreshPrices(this.priceSum);	// update prices
		this.categorySum = this.fnService.getSumByPriceCategory( this.priceCategories);

		// last sums
		this.lastSums.grossSum = this.fnService.getCategorySum( this.categorySum );
		this.lastSums.multipliedSum = this.categorySum.reduce( 
										(acc, cat) => {
											let multiplier = cat.multiplier;
											let val = multiplier && multiplier.value ? multiplier.value : 0;
											return  acc + val;
										}, 0
									);
		this.lastSums.netSum = this.lastSums.grossSum + this.lastSums.multipliedSum;

		this.uniqueEntries = this.fnService.getUniqueEntries( _entries );
		console.log('unique prices: ', this.uniqueEntries);
		this.documents = this.fnService.getSumByDocument( this.documents );
		
	}


	setActivePriceProperty( price: any ): void {
		this.activeTopPrice = price;
	}

	openPriceListDialog(title:string, items: any[] = [], valuePath: string = 'value') {

        let dialogRef$ : MdDialogRef<PriceListDialog>;
        dialogRef$ = this.dialog.open(PriceListDialog);

        if (document) {
            dialogRef$.componentInstance.title = title;
            dialogRef$.componentInstance.items = items;
            dialogRef$.componentInstance.valuePath = valuePath;
			dialogRef$.componentInstance.sorted = false;
		}

	}

}