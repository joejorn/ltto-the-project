import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DocumentEditorService } from '../../shared/services/document/document-editor.service';
import { SheetEditorService } from '../../shared/services/sheet/sheet-editor.service';
import { SheetGroupEditorService } from '../../shared/services/sheet-group/sheet-group-editor.service';

// test
// import * as moment from 'moment';
// import 'moment/locale/th';

@Component({
    moduleId: module.id,
    selector: 'ltto-document-detail',
    templateUrl: 'document-detail.component.html',
    styleUrls: [
        '../../shared/styles/link-list.style.css', 
        '../../shared/styles/detail-styles.css',
        '../../shared/styles/default-text.style.css'
    ]
})

export class DocumentDetailComponent implements OnInit, OnDestroy {

    // internal states
    private loading: boolean;   // UX-spinner
    private docSubscription: Subscription;   // unscription for preventing memory leak

    private _document: BehaviorSubject<any>;
    get document() { return this._document; }
    set document(doc:any) { this._document.next(doc); }

    private sheetList: any[];
    private groupList: any[];

    // test
	private timeParser: any;

    constructor( 
        private routes: ActivatedRoute,
        private router: Router,
        private docService: DocumentEditorService,
        private sheetService: SheetEditorService,
        private groupService: SheetGroupEditorService,
    ){
        this._document = new BehaviorSubject(null);
        this.sheetList = [];
        this.groupList = [];

        // moment().locale('en');
        // this.timeParser = moment;
    }

    ngOnInit(): void {

        this.routes.params.first()
            .subscribe( 
                params => {
                    if (params.hasOwnProperty('documentId')) {
                        this.initComponent(params['documentId']);
                    }
                }
            );
    }

    ngOnDestroy(): void {
        this.docSubscription.unsubscribe();
    }

    private initComponent(documentId:any): void {

        this.docSubscription = this.docService.getDocument(documentId)
                                    .subscribe( doc => {
                                        this._document.next(doc);
                                    } );

        this.sheetService.getSheetInfoList(documentId).first()
            .subscribe( 
                sheets => {

                    // only non-group sheets
                    this.sheetList = sheets.filter( 
                                            sheet => !sheet.hasOwnProperty('groupId')
                                        );
                }
            );

        this.groupService.getSheetGroupInfoList(documentId).first()
            .subscribe( groups => this.groupList = groups );
    }


    /* ACTIONS */

    editDocument(): void {
        let doc = this._document.value;
        if (doc) {
            this.docService.editDocument(
                doc,
                /*(o) => { 
                    console.log('edited document: ', o);
                    // reload page to fetch new document for sub-components
                    if (doc.name !== o.name) {
                        console.log('reload page');
                    }
                }*/
            );
        }
    }

    removeDocument(): void {
        this.document.first().subscribe(
            doc => {
                this.docService.removeDocument(
                    doc, 
                    () => this.router.navigate(['document'])
                )
            }
        );
    }

    addNewSheet(): void {
        let params = {documentId: this._document.value.uid};
        this.sheetService.createSheet(
            this.groupList, 
            params,
            (o) => {// callback
                if (o) {
                    let urlSegments = [];
                    if (o.groupId) {
                        urlSegments = ['sheet-group',o.groupId];
                    } else {
                        urlSegments = ['sheet',o.uid];
                    }
                    this.router.navigate( urlSegments, {relativeTo: this.routes} );
                }

            }
        );

    }

    addNewSheetGroup(): void {
        let params = {documentId: this._document.value.uid};
        this.groupService.createSheetGroup(
            this.sheetList,
            params,
            (o) => {// callback
                if (o)
                    this.router.navigate(['sheet-group', o.uid], {relativeTo: this.routes});
            }
        )
    }
}