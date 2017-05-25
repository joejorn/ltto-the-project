import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MdListItem } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'ltto-price-list',
  templateUrl: 'price-list.component.html',
  styleUrls: ['price-list.component.css']
})

export class PriceListComponent implements AfterViewInit, OnChanges {

	private loading: boolean;

	// private _items: any[];
    private _ascending: string;
    
    @Input() public items: any[];
    @Input() public valuePath: string;
    @Input() public maxItem: number;
    @Input() public selectedIndex: number;

    @Input() public sortProperty: string; // sort by property
    @Input() public sortDirection: string; // sort direction
    
    @Input() public selectable: boolean;    // clickable
    @Input() public indexed: boolean;   // index before name
    
    @Output() selectedItem: EventEmitter<any>;

	// @ViewChildren(MdListItem) listItems: QueryList<MdListItem>;

	constructor(){
        // this._items = [];
        this.valuePath = 'value';
        this.maxItem = 0;  // display all items
        this.indexed = true;

        this.sortProperty = 'name';
        this.sortDirection = 'ascending';

        this.selectedItem = new EventEmitter();
	}

    ngOnChanges( changes: SimpleChanges ) {

        if ( changes['items'] ) {
			// pre-process: assign origin index
			// let _items = changes['items'].currentValue;
			// _items.forEach( (item:any, index: number) => { item['$index'] = index } )
			// this._items = _items;
        }

    }

	ngAfterViewInit() {
		// in case of initial index
		if (this.selectedIndex !== undefined ) {
			/*let elemRef: ElementRef = this.listItems.toArray()[this.selectedIndex]['_element'];
			let originIndex = elemRef.nativeElement.dataset.originIndex;
			this.selectedItem.emit(this._items[originIndex]);*/

			this.selectedItem.emit(this.items[this.selectedIndex]);
		}

	}

    selectItem( index: number, item: any ) {
        if (this.selectable && index !== this.selectedIndex) {
            this.selectedIndex = index;
            this.selectedItem.emit(item);
        }
    }

}
