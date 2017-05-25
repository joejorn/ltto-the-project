import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'ltto-price-tree',
  templateUrl: 'price-tree.component.html',
  styleUrls: ['price-tree.component.css']
})

export class PriceTreeComponent implements OnChanges {

	private loading: boolean;

    private expanded: boolean;
    
    private valueSum: number;

    @Input() public title: string;
    @Input() public values: any[];  // [{ name: '_name_', value: 0 }, ...]
    @Input() public items: any[];   // [{name: '_name_', values: [...]}]
    @Input() public enableSum: boolean;

    @ViewChild('hiddenContent') private hiddenContent: ElementRef;

	constructor(){
        this.expanded = false;

        this.values = [];
        this.enableSum = false;

        this.valueSum = 0;
	}

    ngOnChanges( changes: SimpleChanges ) {
        
        if ( changes['items'] ) {
            let _items = changes['items'].currentValue;
            let itemValues = [];    // value collection of all items
            _items.forEach( item => { 
                if (item.values) {
                    itemValues.concat(item.values) 
                }
                item.valueSum = this.getValueSum( item.values );
                itemValues = itemValues.concat(item.values);
            })

            // update values and sum
            let newValues = this.mergeValues(itemValues);
            this.values = newValues
            this.valueSum = this.getValueSum( newValues );
        }

        if ( changes['values'] ) {
            // compute sum
            this.valueSum = this.getValueSum( changes['values'].currentValue );
        }

    }

    toggleSubItems(): void {

        if (!this.items) {
            return;
        }

        this.expanded = !this.expanded;
        let panel = this.hiddenContent.nativeElement;

        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }

    // compute total amount of values
    private getValueSum( arr: any[] ): number {
        let _arr = arr ? arr : [];
        let val = _arr.reduce( 
            (prevVal: number, curr: any) => {
                let currVal = (curr && curr.value) ? curr.value : 0;
                return prevVal + currVal;
        }, 0);

        return val;
    }

    // merge duplicate value by cumulative addition
    private mergeValues( values: any[] = [] ): any[] {
        let newValues = [];

        if (values.length > 0) {
            let dict = {};
            values.forEach( 
                o => {
                    if (dict.hasOwnProperty(o.name)) {
                        dict[o.name] = dict[o.name] + o.value;
                    } else {
                        dict[o.name] = o.value;
                    }
                }
            )

            newValues = Object.keys(dict).map( 
                                key => {
                                    return {
                                        name: key,
                                        value: dict[key]
                                    }
                                } 
                            );
        }
        return newValues;
    }

}
