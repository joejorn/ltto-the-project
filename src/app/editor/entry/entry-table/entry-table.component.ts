import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MdButtonToggleChange } from '@angular/material';
import { Observable } from 'rxjs';

import { EntryEditorService } from "../service/entry-editor.service";


@Component({
	moduleId: module.id,
	selector: 'ltto-entry-table',
	templateUrl: 'entry-table.component.html',
	styleUrls: ['entry-table.component.css']
})

export class EntryTableComponent implements OnInit, OnChanges {

	static DEFAULT_CATEGORY: string = '$all';

	// entries : any[];
	private entries: Observable<any[]>;	// real-time db

	@Input() sheetId: string;
	@Input() documentId: string;

	
	// Category
	categories: any[];

	private priceList: any[];
	private activeCategory: string;


	//  Column
	private columns: any[];
	private baseColumns: any[] = [
			{ 	
				name: '#', 
				property: '_index', 
				class: 'mdl-data-table__cell--non-numeric cell-compact',
				categoryId: EntryTableComponent.DEFAULT_CATEGORY
			},
			{ 	
				name: 'รายการ', 
				property: 'name', 
				class: 'mdl-data-table__cell--non-numeric',
				categoryId: EntryTableComponent.DEFAULT_CATEGORY
			}
		]
	
	// Default Row
	private _defaultRow = {
		content: 'ไม่พบรายการใดๆ',
		class: 'mdl-data-table__cell--non-numeric'
	}

	constructor( private dataService: EntryEditorService ) {
		this.activeCategory = EntryTableComponent.DEFAULT_CATEGORY;	// default category
		this.columns = this.baseColumns;
	}

	ngOnInit(): void {

		// init tabs
		this.dataService.getEntryPriceCategories()
			.first()
			.subscribe( 
				_categories => {
					console.log('categories: ', _categories);
					this.categories = _categories;
				}
			);
		
		// init columns
		this.dataService.getEntryPriceInfo()
			.first()
			.subscribe( 
				prices => {
					this.priceList = prices;
					this.columns= this.baseColumns.concat(this.priceList);
				}
			)

	}

	ngOnChanges(changes: SimpleChanges): void {
		for (let propName in changes) {
			if (propName === 'sheetId') {	// reload entries
				let change = changes[propName];
				this.initComponent(change.currentValue);
			}
		}
	}

	initComponent(sheetId: string): void {
		this.entries = 	this.dataService.getEntryListBySheet(sheetId)
							.map( 
								entries => {
									entries.forEach((entry, index) => 
										Object.assign(entry, {_index: index + 1})	// row index
									)
									return entries;								
								}
							);
	}
	
	
	onCategoryChange(e: MdButtonToggleChange): void {
		this.activeCategory = e.value;
	}


	addNewEntry(): void {
		let params = {
			sheetId: this.sheetId,
			documentId: this.documentId,
			priceList: this.priceList,
			categories: this.categories
		}
		this.dataService.createEntry(params);
	}

	editEntry(o:any): void {
		let params = {
			priceList: this.priceList,
			categories: this.categories
		}
		this.dataService.editEntry(o, params);
	}

}