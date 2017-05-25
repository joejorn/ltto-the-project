import { Injectable } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

import { SheetGroupFormDialog } from '../../../sheet-group/dialog/sheet-group-form.dialog';
import { SheetGroupDataService } from '../../../../service-module/database/data/sheet-group/sheet-group.service';
import { AlertService } from '../../../../core/alert/alert.service';


@Injectable()
export class SheetGroupEditorService {

    constructor( 
        private dataService: SheetGroupDataService,
        private alertService: AlertService,
        private dialog: MdDialog
    ){}


    /* Query */

    getSheetGroup(id: string): Observable<any> {
        return  this.dataService.getObject(id);
    }

    // get one including its content
    getSheetGroupInfo(id: string): Observable<any> {
        return  this.dataService.getExtendedObject(id);
    }

    getSheetGroupList(documentId: string): Observable<any[]> {
        return this.dataService.getObjectList(documentId);
    }

    // each contains underlying content
    getSheetGroupInfoList(documentId: string): Observable<any[]> {
        return this.dataService.getExtendedObjectList(documentId);
    }



    /* Form */

    createSheetGroup(collect: any[] = [], params?: any, callback?: any): void {

        this.openFormDialog(null, params.documentId, collect)
            .first()
            .subscribe( 
                msg => {
                    console.log('[SHEET-GROUP] message from dialog: ', msg);
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            );
    }

    editSheetGroup(o: any, collect: any[] = [], callback?: any): void {
        this.openFormDialog(o, o.documentId, collect)
            .first()
            .subscribe( 
                msg => {
                    console.log('[SHEET-GROUP] message from dialog: ', msg);
                    if (msg && msg.success && callback)
                        callback(msg.result);
                } 
            );
    }

    removeSheetGroup(o: any, callback?: any): void {
        let objTxt = `"${o.name}" including its entries`;
        let title = `Are you sure you want to delete ${objTxt}?`;
        let subtitle = 'The item(s) will be deleted permanently. You can’t undo this action.';
        
        this.alertService.openConfirmDialog(title, subtitle)
            .first()
            .subscribe( 
                bool => {
                    if (bool) { // continue deletion
                        this.dataService.remove(o)
                            .then(
                                o => {
                                    console.log(`Sheet group-"${o.name}" has been removed.`);
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
        sheetGroup: any, 
        documentId: string, 
        sheetList: any[]
    ) : Observable<any> {
        
        let dialogRef$ : MdDialogRef<SheetGroupFormDialog>
        dialogRef$ = this.dialog.open(SheetGroupFormDialog);

        dialogRef$.componentInstance.sheetList = sheetList;
        dialogRef$.componentInstance.documentId = documentId;
        dialogRef$.componentInstance.formObject = sheetGroup;

        return dialogRef$.afterClosed();
    }

}