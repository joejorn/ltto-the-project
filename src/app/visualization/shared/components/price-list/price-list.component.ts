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

export class PriceListComponent implements OnChanges {

	private loading: boolean;

	// private _items: any[];
    private _ascending: string;
    
    @Input() public items: any[];
    @Input() public valuePath: string;
    @Input() public maxItem: number;
    @Input() public selectedIndex: number;

    @Input() public sortProperty: string; // sort by property
    @Input() public sortDirection: string; // sort direction
    
    @Input() public sorted: boolean;    // sort required
    @Input() public selectable: boolean;    // clickable
    @Input() public indexed: boolean;   // index before name
    
    @Output() selectedItem: EventEmitter<any>;

	// @ViewChildren(MdListItem) listItems: QueryList<MdListItem>;

	constructor(){
        // this._items = [];
        this.valuePath = 'value';
        this.maxItem = 0;  // display all items
        this.indexed = true;

        this.sorted = false;
        this.sortProperty = 'name';
        this.sortDirection = 'ascending';

        this.selectedItem = new EventEmitter();

        this.loading = true;
	}

    ngOnChanges( changes: SimpleChanges ) {

        if ( changes['items']) {

            // sort
            if (this.sorted) {
                this.sortItems();
            }

            if (this.items.length > 0 && this.loading) {
                this.selectedItem.emit(this.items[this.selectedIndex]);
                this.loading = false;
            }
            
        } else if (changes['sortProperty']) {
            this.sortItems();
        }
    }

    sortItems(): void {
        let ascending = this.sortDirection === 'ascending';
        this.items.sort(
            (a,b) => {
                let arr = [a,b].map( elem => {
                    let val = elem[this.sortProperty];
                    if (typeof val === 'number') {
                        return val;
                    } else if (!val) {
                        return 0;
                    } else {
                        return ('' + val).toUpperCase();
                    }
                });

                let newPos = 0; // default: no position change
                if (arr[0] < arr[1]) {
                    
                    newPos = ascending ? -1 : 1;

                } else if (arr[0] > arr[1]) {
                    
                    newPos = ascending ? 1 : -1;

                }
                return newPos;
            }
        );
    }

    selectItem( index: number, item: any ) {
        if (this.selectable && index !== this.selectedIndex) {
            this.selectedIndex = index;
            this.selectedItem.emit(item);
        }
    }

}
