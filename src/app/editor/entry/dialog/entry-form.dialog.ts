import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { EntryDataService } from '../../../service-module/database/data/entry/entry.service';
import { PreferenceService } from '../../../service-module/database/preference/preference.service';

@Component({
  selector: 'ltto-entry-form-dialog',
  templateUrl: 'entry-form.dialog.html',
  styleUrls: ['../../shared/styles/form-styles.css']
})

export class EntryFormDialog implements OnInit {

    // form value / object
	private _defaultValue : any; // default value for form object
    private entryForm: FormGroup;   // form control
    public formObject: any;    // inital form value object

    // statement
    private next: boolean;  // ignore closing form
    private isEditing = false;  // new- vs. edit-mode

    public categories: string[];   // price categoires
	public priceList: any[];  // price list


    constructor(
			private fb: FormBuilder, 
			private entryService: EntryDataService,
            private prefService: PreferenceService,
			private dialogRef: MdDialogRef<EntryFormDialog> 
	) {	

        this._defaultValue = { name: '', remarks:'', prices: {}, sheetId: '', documentId: '' };

        // init form control
        this.entryForm = this.fb.group({
			name: [ '', [Validators.required, Validators.maxLength(3)]],
			prices: this.fb.group({}),
			remark: '',
            sheetId: '',
            documentId: ''
		});

    }

    ngOnInit(): void {
        // set prices
        if (this.priceList) {
            let prices = this.priceList.reduce( (prev, curr) => {
                prev[curr.property] = '';
                return prev;
            }, {});
            this._defaultValue.prices = prices;
            this.entryForm.setControl('prices', this.fb.group(prices) );
        }

        this.isEditing = this.formObject ? true : false;

        let o = this.formObject ? this.formObject : this._defaultValue;
        this.entryForm.patchValue(o);
    }

    setParameter(prop: string, value: any): void {
        if (this._defaultValue.hasOwnProperty(prop) && value) {
            // console.log(`set parameter "${prop}" -> "${value}"`);
            this._defaultValue[prop] = value;
        }
    }

    reset(): void {
        this.entryForm.patchValue(this._defaultValue);
    }

    setNext(bool: boolean) {
        this.next = bool;
    }

    // post-processing
    onSubmit() {

        let formOutput = this.entryForm.value;

        if (formOutput.name.length < 1) {
            formOutput.name = 'Untitled';
        }

        if (this.isEditing) {
            formOutput.uid = this.formObject.uid;

            this.entryService.update(this.formObject, formOutput)
                .then( 
                    () => this.onReturnResult(true, formOutput),
                    err => this.onReturnResult(false, err) 
                );
        } else {
            this.entryService.add(formOutput)
                .then( 
                    o => {
                        if (!this.next) {
                            this.onReturnResult(true, o);
                        } else {
                            this.reset();
                        }
                    }, 
                    err => this.onReturnResult(false, err) 
                );
        }
    }

    onRemove() {
        this.entryService.remove(this.formObject)
            .then( 
                o => this.onReturnResult(true, o),
                err => this.onReturnResult( false, err )
            );
    }

    onReturnResult(success?: boolean, opt?:any) : void {

        let message = {
            success: success,
            result: opt ? opt : this.entryForm.value
        }
        this.dialogRef.close(message);
    }


}
