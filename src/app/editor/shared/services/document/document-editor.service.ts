import { Injectable } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

import { AlertService } from '../../../../core/alert/alert.service';
import { UserService } from '../../../../service-module/database/user/user.service';
import { DocumentDataService } from '../../../../service-module/database/data/document/document.service';

import { DocumentFormDialog } from '../../../document/dialog/document-form.dialog';

@Injectable()
export class DocumentEditorService {

    constructor( 
        private userService: UserService,
        private dataService: DocumentDataService,
        private alertService: AlertService,
        private dialog: MdDialog
    ){}


    /* Query */

    getDocument(id: string): Observable<any> {
        return  this.dataService.getObject(id);
    }

    // get one including its content
    getDocumentInfo(id: string): Observable<any> {
        return  this.dataService.getExtendedObject(id);
    }

    getDocumentList(): Observable<any[]> {
        // TODO: check role
        return this.dataService.getObjectList( this.getQueryFilter() );
    }

    // each contains underlying content
    getDocumentInfoList(): Observable<any[]> {
        
        return this.dataService.getExtendedObjectList( this.getQueryFilter() );
    }

    private getQueryFilter(): string {
        let _id: string;
        // check user role
        let user = this.userService.getCurrentUser();
        if (!user.roles['reviewer']) {
            _id = user.uid;
        }

        return _id;
    }


    /* Form */

    createDocument(callback?: any): void {
        this.openFormDialog(null)
            .first()
            .subscribe( 
                msg => {
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            );
    }

    editDocument(o: any, callback?: any): void {
        this.openFormDialog(o)
            .first()
            .subscribe( 
                msg => {
                    if (msg && msg.success && callback)
                        callback(msg.result);
                }
            );
    }

    removeDocument(o: any, callback?: any): void {
        let objTxt = '"' + o.name + '" including its content';
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
                                    console.log('[DEL][DOC] updates: ', o);
                                    // console.log(`Document-"${o.name}" has been removed.`);
                                    if (callback) {
                                        callback(o);
                                    }
                                }
                            )
                    }
                }
            );
    }

    private openFormDialog( document: any ) : Observable<any> {

        let dialogRef$ : MdDialogRef<DocumentFormDialog>;
        dialogRef$ = this.dialog.open(DocumentFormDialog);

        if (document) 
            dialogRef$.componentInstance.formInput = document;

        return dialogRef$.afterClosed();
    }

}