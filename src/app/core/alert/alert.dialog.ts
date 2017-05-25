import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

// declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'ltto-alert-dialog',
    template: `
        <div class="dialog-header" *ngIf="title">
            <h5 class="dialog-header-title">{{title}}</h5>
        </div>
        <div class="dialog-main">
            <p class="dialog-description">{{text}}</p>
        </div>
        <div class="dialog-actions">
            <button md-button (click)="dialogRef.close(true)">OK</button>
            <button md-button (click)="dialogRef.close(false)">Cancel</button>
        </div>
    `,
    styles: [`
        :host { display: block; padding: 24px; }
        .dialog-header { font-weight: 500; }
        .dialog-description { color: rgba(0,0,0,0.62); }
        .dialog-actions { margin-top: 5em; }
        .dialog-actions > button { margin-right: 1em; }
    `],
    // styleUrls: ['form-styles.css']
})

export class AlertDialog {

    title: string;
    text: string;

    constructor( public dialogRef: MdDialogRef<AlertDialog> ) {}
}