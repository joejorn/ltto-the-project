import { Injectable, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { Observable } from 'rxjs';

import { ConfirmDialog } from './alert.dialog';


@Injectable()
export class ConfirmService {

    constructor( private dialog: MdDialog ) {}

    openConfirmDialog( 
        title: string, 
        txt: string
    ) : Observable<boolean> {
        
        let dialogRef$ : MdDialogRef<ConfirmDialog>
        dialogRef$ = this.dialog.open(ConfirmDialog);
        dialogRef$.componentInstance.title = title;
        dialogRef$.componentInstance.text = txt;

        return dialogRef$.afterClosed();
    }

}

