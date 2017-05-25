import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs';

import { SheetGroupDataService } from '../../../service-module/database/data/sheet-group/sheet-group.service';

// declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'ltto-sheet-group-form-dialog',
    templateUrl: 'sheet-group-form.dialog.html',
    styleUrls: [
        '../../shared/styles/form-styles.css'
    ]
})

export class SheetGroupFormDialog implements OnInit {

    private isEditing : boolean;    // state
    private _defaultValue : any; // default value for form object
    
    // reactive form
    private formGroup : FormGroup; 

    // parameters
    public formObject: any;
    public documentId: string;
    private _sheetList : any[]; // internal statement
    public sheetList: any[];


    constructor( 
        private fb: FormBuilder,
        private dataService: SheetGroupDataService,
        public dialogRef: MdDialogRef<SheetGroupFormDialog>
    ) {
        this.isEditing = false;
        this._defaultValue = { name: '', members: {}, documentId: '' };

        this.formGroup = this.fb.group({
            name: '',
            members: this.fb.group({}),
            documentId: ['', [Validators.required]]
        });

    }

    ngOnInit(): void {
        this._defaultValue.documentId = this.documentId;   // for all new sheets
        this.loadDynamicList();
        this.loadFormValues();
    }

    loadFormValues(): void {
        this.isEditing = this.formObject ? true : false;
        if (this.formObject) {
            this.formGroup.patchValue(this.formObject);
        } else {
            this.formGroup.reset(this._defaultValue);
        }
    }

    loadDynamicList(): void {
        let refProp$ = this.dataService.REF_PROPERTY_NAME;
        this._sheetList = this.sheetList.filter( 
                                sheet => {
                                    let bool = false;
                                    if (!sheet.hasOwnProperty(refProp$)) {
                                        bool = true;
                                    } else if (this.formObject) {
                                        bool = sheet[refProp$] === this.formObject.uid;
                                    }
                                    return bool;
                                }
                            );
        console.log('sheet list: ', this._sheetList);

        let _fg = {};
        if (this._sheetList) {
            this._sheetList.forEach( sheet => {
                _fg[sheet.uid] = false;
            });
        }

        this._defaultValue.members = _fg;
        this.formGroup.setControl("members", this.fb.group(_fg));
    }

    // post-processing
    onSubmit() {

        let formOutput = this.formGroup.value;

        // default name
        if (formOutput.name.length < 1) {
            formOutput.name = 'Untitled';
        }

        // remove all members with 'false'-value
        for (let member in formOutput.members) {
            if (!formOutput.members[member]) {
                // console.log('remove property: ', member);
                delete formOutput.members[member];
            }
        }

        // pass unique ID
        if (this.formObject) {
            formOutput.uid = this.formObject.uid;
        }

        console.log('value on submit: ', formOutput);   // temp

        if (this.isEditing) {
            // this.dataService.update(this._formObject, formOutput)
            this.dataService.update(this.formObject, formOutput)
                .then( 
                    () => this.onReturnResult(true, formOutput),
                    err => this.onReturnResult(false, err) 
                );
        } else {
            this.dataService.add(formOutput)
                .then( 
                    o => this.onReturnResult(true, o),
                    err => this.onReturnResult(false, err) 
                );
        }
        
        // this.dataService.updateSheet(value);
    }

    onReturnResult(success?: boolean, opt?:any) : void {

        if (success) {
            if (this.isEditing)
            console.log('Sheet group has been updated.\n');
        else
            console.log('New sheet group has been added.\n');
        }

        let message = {
            success: success? success : false,
            result: opt ? opt : this.formObject
        }
        this.dialogRef.close(message);
    }

}