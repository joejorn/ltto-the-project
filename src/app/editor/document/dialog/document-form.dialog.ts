import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { DocumentDataService } from '../../../service-module/database/data/document/document.service';

@Component({
    moduleId: module.id,
    selector: 'ltto-document-form-dialog',
    templateUrl: 'document-form.dialog.html',
    styleUrls: ['../../shared/styles/form-styles.css']
    
})

export class DocumentFormDialog implements OnInit, OnChanges {

    formObject: any;

    @Input() formInput: any;
    @Input() isEditing: boolean;
    
    @Output() formOutput = new EventEmitter<void>();;

    constructor(
        private docService: DocumentDataService, 
        public dialogRef: MdDialogRef<DocumentFormDialog>
    ) {}

    ngOnInit(): void {
        if (this.formInput) {
            this.isEditing = true;
            this.formObject = JSON.parse(JSON.stringify(this.formInput));
        } else {
            this.reset();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {

            if (propName == 'formInput') {
                var newValue = changes[propName].currentValue;

                if (newValue) {
                    this.formObject = JSON.parse(JSON.stringify(this.formInput));
                    // console.log('set new form object: ', this.formObject);
                } else {
                    this.reset();
                }
                
            }

        }
    }

    reset(): void {
        this.formObject = {
            name: '',
            description: ''
        }
        this.isEditing = false;
    }


    onSubmit(): void {
        if (this.formObject.name.length < 1) {
            this.formObject.name = 'Untitled';
        }

        // console.log('summit data: ', this.formObject);

        if (this.isEditing) {
            this.docService.update(this.formInput, this.formObject)
                .then( 
                    () => this.onReturnResult(true), 
                    err => this.onReturnResult(false, err)
                );
        } else {
            this.docService.add(this.formObject)
                .then(
                    () => this.onReturnResult(true), 
                    err => this.onReturnResult(false, err)
                );
        }
    }

    onCancel(): void {
        this.onReturnResult(false);
    }

    onReturnResult(success?: boolean, opt?:any) : void {

        /*if (success) {
            if (this.isEditing)
                console.log('Document has been updated.\n');
            else
                console.log('New document has been added.\n');
        }*/

        let message = {
            success: success,
            result: success ? this.formObject : opt
        }
        this.dialogRef.close(message);
    }
}