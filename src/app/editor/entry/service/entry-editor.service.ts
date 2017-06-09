import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { ConfirmService } from '../../../core/alert/alert.service';
import { EntryFormDialog } from '../dialog/entry-form.dialog';
import { EntryDataService } from '../../../service-module/database/data/entry/entry.service';
import { PreferenceService } from "../../../service-module/database/preference/preference.service";


@Injectable()
export class EntryEditorService {

    constructor( 
        private dataService: EntryDataService,
        private prefService: PreferenceService,
        private confirmService: ConfirmService,
        private dialog: MdDialog
    ){}

    getEntryPriceInfo(): Observable<any[]> {
        return this.prefService.getPriceList();
    }

    getEntryPriceCategories(): Observable<any[]> {
        return this.prefService.getPriceCategories();
    }


    /* Query */

    getEntry(id: string): Observable<any> {
        return  this.dataService.getObject(id);
    }

    getEntryListByDocument(documentId: string): Observable<any[]> {
        return this.dataService.getObjectListByProperty('documentId', documentId);
    }

    getEntryListBySheet(sheetId: string): Observable<any[]> {
        return this.dataService.getObjectListByProperty('sheetId', sheetId);
    }



    /* Form */

    createEntry(params?:any, callback?: any): void {
        this.openFormDialog(null, params).first()
            .subscribe( 
                msg => {
                    // console.log('message from dialog: ', msg);
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            );
    }

    editEntry(o: any, params?: any): void {
        this.openFormDialog(o, params);
    }

    removeEntry(o: any, callback?: any): void {
        let objTxt = `"${o.name}"-entry`;
        let title = `Are you sure you want to delete ${objTxt}?`;
        let subtitle = 'The item(s) will be deleted permanently. You can’t undo this action.';
        
        this.confirmService.openConfirmDialog(title, subtitle)
            .subscribe( 
                bool => {
                    if (bool) { // continue deletion
                        this.dataService.remove(o)
                            .then(
                                o => {
                                    console.log(`"${o.name}"-entry has been removed.`);
                                    if (callback) {
                                        callback(o);
                                    }
                                }
                            )
                    }
                }
            );
    }

    openFormDialog( 
        entry: any,
        params?: Object
    ) : Observable<any> {

        let dialogRef$ : MdDialogRef<EntryFormDialog>;
        dialogRef$ = this.dialog.open(EntryFormDialog);

        dialogRef$.componentInstance.formObject = entry;

        let props = ['documentId', 'sheetId', 'priceList', 'categories'];  // accepted parameters
        if (params) {
            props.forEach( (prop: string, index: number) => {
                if (params.hasOwnProperty(prop) && params[prop]) {
                    if (index < 2)
                        dialogRef$.componentInstance.setParameter(prop, params[prop]);
                    else
                        dialogRef$.componentInstance[prop] = params[prop];

                }
            })
        }

        return dialogRef$.afterClosed();
    }

}