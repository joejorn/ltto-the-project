import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DocumentEditorService } from '../../shared/services/document/document-editor.service';
import { SheetEditorService } from '../../shared/services/sheet/sheet-editor.service';
import { SheetGroupEditorService } from '../../shared/services/sheet-group/sheet-group-editor.service';

import { EntryTableComponent } from '../../entry/entry-table/entry-table.component'

@Component({
    moduleId: module.id,
    selector: 'ltto-sheet-detail',
    templateUrl: 'sheet-detail.component.html',
    styleUrls: [
        '../../shared/styles/detail-styles.css',
        '../../../shared-module/styles/fab.style.css',
        '../../../shared-module/styles/pre-loader.style.css'
    ]
})

export class SheetDetailComponent implements OnInit, OnDestroy {
    // component statement
    private loading: boolean;
    private removing: boolean;

    private document: any; // navigation
    private sheetGroups: Observable<any[]>; // needed for edit-mode

    // component context
    private _sheet: BehaviorSubject<any>;
    public get sheet() { return this._sheet.getValue(); }
    public set sheet(o: any) { this._sheet.next(o); }

    // Subscription
    private subscriptions: Subscription[];

    @ViewChild(EntryTableComponent) private table$:EntryTableComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sheetService: SheetEditorService,
        private documentService: DocumentEditorService,
        private groupService: SheetGroupEditorService
    ){
        this.loading = true;
        this._sheet = new BehaviorSubject(null);
        this.subscriptions = [];
    }

    ngOnInit(): void {
        // extract URL parameters
        
        // TODO: --> use parent's resolver
        this.route.parent.params.first()
            .subscribe(
                param => {
                    this.documentService.getDocument(param['documentId'])
                        .first()
                        .subscribe( doc => this.document = doc );
                }
            )
        
        // console.log('parent data: ', this.route.parent.snapshot.data);

        let subscription = this.route.params
                                .subscribe( 
                                    param => {
                                        this.initComponent(param['sheetId']);
                                    } 
                                );
        this.subscriptions.push(subscription);
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach( 
            subscription => subscription.unsubscribe() 
        );
    }

    initComponent(sheetId: string): void {

        let subscription =  this.sheetService.getSheet(sheetId)
                                .subscribe( 
                                    sheet => { 
                                        if (sheet.$exists()){
                                            this._sheet.next(sheet);
                                            setTimeout( () => this.loading = false, 500);
                                        }
                                    } 
                                );
        this.subscriptions.push(subscription);
    }

    editSheet(): void {
        let sheet = this._sheet.getValue();
        this.groupService.getSheetGroupList( this.document.uid )
            .first()
            .subscribe(
                groups => {
                    this.sheetService.editSheet(
                        sheet, 
                        groups,
                        o => {  // callback
                            if (sheet.groupId !== o.groupId ) { // group change
                                this.router.navigate(
                                    ['../../', 'sheet-group', o.groupId], 
                                    {relativeTo: this.route}
                                );
                            }
                        }
                    );
                }
            );
    }

    removeSheet(): void {
        this.removing = true;

        this.sheetService.removeSheet(
            this._sheet.getValue(), 
            () => this.router.navigate(['../../'], {relativeTo: this.route})
        );

    }

    addNewEntry(): void {
        this.table$.addNewEntry();
    }

}