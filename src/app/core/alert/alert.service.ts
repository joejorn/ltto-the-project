import { Injectable, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { Observable } from 'rxjs';

import { AlertDialog } from './alert.dialog';


@Injectable()
export class AlertService {

    constructor( private dialog: MdDialog ) {}

    openConfirmDialog( 
        title: string, 
        txt: string
    ) : Observable<boolean> {
        
        let dialogRef$ : MdDialogRef<AlertDialog>
        dialogRef$ = this.dialog.open(AlertDialog);
        dialogRef$.componentInstance.title = title;
        dialogRef$.componentInstance.text = txt;

        return dialogRef$.afterClosed();
    }

}

