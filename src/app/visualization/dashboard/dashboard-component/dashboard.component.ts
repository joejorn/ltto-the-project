import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisualizationFnService } from '../../shared/services/visualization-fn.service';
import { IDetailedDocument } from '../../shared/interfaces/detail-document.interface';

@Component({
  moduleId: module.id,
  selector: 'ltto-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit {

	private maxListSize: number;

	// statements
	private loading: boolean;	// component's state
	private activeTopPrice: any;	// buttons state

	// component's input
	@Input() priceList: any[];
	@Input() documents: any[];

	private counters: any;

	// calculated
	private priceSum: any[];
	private categorySum: any[];
	private lastSum: number;
	
	private uniqueEntries: any[];


	constructor( private fnService: VisualizationFnService, private route: ActivatedRoute ){

		this.documents = [];
		this.priceList = [];

		this.counters = {};
		this.maxListSize = 5;
		
		this.processDocuments( this.documents, this.priceList);
	}

    ngOnInit() {
        this.route.data.subscribe(
            (data: { documents: any[], prices: any[] }) => {
                this.documents = data.documents
                this.priceList = data.prices;
				this.processDocuments( this.documents, this.priceList);
            }
        );
    }

	// calculate required values
	private processDocuments(docs: any[], prices: any[] = []): void {

		this.activeTopPrice = prices[0];

		// Sheet Counter
		let shLen = 0;
		if (docs) {
			shLen = docs.reduce( 
						(prev, doc) => { 
							let len = doc._sheets ? doc._sheets.length : 0;
							return prev + len;
						}, 0
					);
		}
		this.counters['sheets'] =  shLen;

		// Merge entries of all documents into one single array
		let _entries = [].concat( ...docs.map( (doc) => { return doc._entries ? doc._entries : []; } ) );

		// Entry Counter
		this.counters['entries'] = _entries.length;

		this.priceSum = this.fnService.getSumByPrice( prices, _entries );
		this.categorySum = this.fnService.getSumByCategory( this.priceSum );
		this.lastSum = this.fnService.getCategorySum( this.categorySum );

		this.uniqueEntries = this.fnService.getUniqueEntries( _entries );

		this.documents = this.fnService.getSumByDocument( docs, _entries );
		
	}


	setActivePriceProperty( price: any ): void {
		this.activeTopPrice = price;
	}

}