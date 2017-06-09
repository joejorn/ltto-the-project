import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'ltto-price-list-dialog',
    templateUrl: 'price-list.dialog.html',
    styleUrls: [ 'price-list.dialog.css' ]
})

export class PriceListDialog implements OnInit {

    items: any[];
    title: string;
    valuePath: string;
    sortDirection: string;
    sorted: boolean;

    @Input() formInput: any;
    @Input() isEditing: boolean;

    constructor( public dialogRef: MdDialogRef<PriceListDialog> ) {
        this.items = [];
        this.title = 'Items';
        this.valuePath = 'value';
        this.sorted = false;
        this.sortDirection = 'descending';
    }

    ngOnInit(): void {

    }


    onClose(): void {
        this.dialogRef.close();
    }
}