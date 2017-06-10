import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocumentEditorService } from '../../shared/services/document/document-editor.service';


@Component({
    moduleId: module.id,
    selector: 'ltto-document-browser',
    templateUrl: 'document-browser.component.html',
    styleUrls: [
        '../../../shared-module/styles/fab.style.css',
        '../../../shared-module/styles/pre-loader.style.css',
        '../../shared/styles/link-list.style.css', 
        '../../shared/styles/default-text.style.css',
        'document-browser.component.css'
    ]
})

export class DocumentBrowserComponent implements OnDestroy  {


    private loading: boolean;

    public documentList: Observable<any[]>;
    private listSubscription: Subscription;

    editMode: boolean = false;

    constructor( public docService: DocumentEditorService )  {
        this.loading = true;
        this.documentList = docService.getDocumentList();
        this.listSubscription = this.documentList.subscribe( docs => {
                        if (this.loading) {
                            // simultaneous delay
                            setTimeout(() => this.loading = false , 500);
                        }
                    } );
    }

    // clear memory
    ngOnDestroy(): void {
        this.listSubscription.unsubscribe();
    }

    /**
     * onClick() Actions
     */

    onClickAddBtn(): void {
        this.docService.createDocument(
            (result: Object) => {   // callback
                console.log('message from dialog: ', result);
            }
        );
    }
    
    // list item action
    onClickSubMenuBtn($event) {
        // stop event propagation & must return false for <a>
        $event.stopImmediatePropagation();
        return false;
    }

    onClickRemoveBtn(doc: any): void {
        console.log('remove document: ', doc.name);
        this.docService.removeDocument(doc)
    }

}