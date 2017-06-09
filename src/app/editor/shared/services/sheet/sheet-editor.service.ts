import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { ConfirmService } from '../../../../core/alert/alert.service';
import { SheetDataService } from '../../../../service-module/database/data/sheet/sheet.service';
import { SheetFormDialog } from '../../../sheet/dialog/sheet-form.dialog';


@Injectable()
export class SheetEditorService {

    constructor( 
        private dataService: SheetDataService,
        private confirmService: ConfirmService,
        private dialog: MdDialog 
    ){}


    /* Query */

    getSheet(id: string): Observable<any> {
        return  this.dataService.getObject(id);
    }

    // get one including its content
    getSheetInfo(id: string): Observable<any> {
        return  this.dataService.getExtendedObject(id);
    }

    getSheetList(documentId: string): Observable<any[]> {
        return this.dataService.getObjectList(documentId);
    }

    // each contains underlying content
    getSheetInfoList(documentId: string): Observable<any[]> {
        return this.dataService.getExtendedObjectList(documentId);
    }

    getSheetListByGroup(groupId: string): Observable<any[]> {
        return this.dataService.getObjectListByProperty('groupId', groupId);
    }



    /* Form */

    createSheet(collect: any[] = [], params?:any, callback?: any): void {
        this.openFormDialog(null, collect, params)
            .first()
            .subscribe( 
                msg => {
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            );
    }

    editSheet(o: any, collect: any[] = [], callback?: any): void {
        this.openFormDialog(o, collect)
            .first()
            .subscribe(
                msg => {
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            )
    }

    removeSheet(o: any, callback?: any): void {
        let title = `ยืนยันการลบ "${o.name}" และรายการซื้อขายที่เกี่ยวข้อง`;
        let subtitle = 'ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้อีก';
        
        this.confirmService.openConfirmDialog(title, subtitle)
            .subscribe( 
                bool => {
                    if (bool) { // continue deletion
                        this.dataService.remove(o)
                            .then(
                                o => {
                                    // console.log(`Sheet-"${o.name}" has been removed.`);
                                    if (callback) {
                                        callback(o);
                                    }
                                }
                            )
                    }
                }
            );
    }

    private openFormDialog( 
        sheet: any,
        groupList: any[],
        params?: Object
    ) : Observable<any> {
        
        let dialogRef$ : MdDialogRef<SheetFormDialog>;
        dialogRef$ = this.dialog.open(SheetFormDialog);

        dialogRef$.componentInstance.formObject = sheet;
        dialogRef$.componentInstance.groupList = groupList;

        let props = ['documentId', 'groupId'];  // accepted parameters
        if (params) {
            props.forEach( prop => {
                if (params.hasOwnProperty(prop) && params[prop]) {
                    // dialogRef$.componentInstance[prop] = params[prop];
                    dialogRef$.componentInstance.setParameter(prop, params[prop]);
                }
            })
        }

        return dialogRef$.afterClosed();
    }

}