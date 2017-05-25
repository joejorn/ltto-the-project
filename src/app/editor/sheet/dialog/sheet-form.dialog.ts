import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs';

import { SheetDataService } from '../../../service-module/database/data/sheet/sheet.service';

@Component({
    moduleId: module.id,
    selector: 'ltto-sheet-form-dialog',
    templateUrl: 'sheet-form.dialog.html',
    styleUrls: ['../../shared/styles/form-styles.css']
})

export class SheetFormDialog implements OnInit {

    private isEditing : boolean;    // state
    private _defaultValue : any; // default value for form object

    // parameters
    public documentId: string;
    public groupList : any[];


    // parameterized form
    public formObject : any;
    

    // reactive form
    sheetForm : FormGroup; 


    constructor( 
        private fb: FormBuilder,
        private dataService: SheetDataService,
        public dialogRef: MdDialogRef<SheetFormDialog>
    ) {
        
        this._defaultValue = { name: '', description: '', groupId: '', documentId: '' };

        // this.setForm();
        this.sheetForm = this.fb.group({
            name: '',
            description: '',
            groupId: '',
            documentId: ['', [Validators.required]]
        });

    }

    setParameter(prop: string, value: any): void {
        if (this._defaultValue.hasOwnProperty(prop) && value) {
            this._defaultValue[prop] = value;
        }
    }

    ngOnInit(): void {
        this.isEditing = this.formObject ? true : false;

        let o = this.formObject ? this.formObject : this._defaultValue;
        this.sheetForm.patchValue(o);   
    }


    // post-processing
    onSubmit() {

        let formOutput = this.sheetForm.value;

        if (formOutput.name.length < 1) {
            formOutput.name = 'Untitled';
        }

        if (this.isEditing) {
            // formOutput.uid = this.formObject.uid;
            this.dataService.update(this.formObject, formOutput)
                .then( 
                    o => this.onReturnResult(true, o),
                    err => this.onReturnResult(false, err) 
                );
        } else {
            this.dataService.add(formOutput)
                .then( 
                    o => this.onReturnResult(true, o), 
                    err => this.onReturnResult(false, err) 
                );
        }
        
    }

    onReturnResult(success?: boolean, opt?:any) : void {

        if (success) {
            if (this.isEditing)
                console.log('Sheet has been updated.\n');
            else
                console.log('New sheet has been added.\n');
        }

        let message = {
            success: success,
            result: opt ? opt : this.formObject
        }
        this.dialogRef.close(message);
    }
}