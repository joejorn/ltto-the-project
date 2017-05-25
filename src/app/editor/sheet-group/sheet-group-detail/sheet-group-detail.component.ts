import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MdTabChangeEvent } from '@angular/material';

import { DocumentEditorService } from '../../shared/services/document/document-editor.service';
import { SheetGroupEditorService } from '../../shared/services/sheet-group/sheet-group-editor.service';
import { SheetEditorService } from '../../shared/services/sheet/sheet-editor.service';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { EntryTableComponent } from '../../entry/entry-table/entry-table.component'


@Component({
    moduleId: module.id,
    selector: 'ltto-sheet-group-detail',
    templateUrl: 'sheet-group-detail.component.html',
    styleUrls: ['../../shared/styles/detail-styles.css']
})

export class SheetGroupDetailComponent implements OnInit, OnDestroy {

    // component statements
    private loading: boolean;
    private removing: boolean; // ignore not-found-redirect

    private document: any;  // navigation
    private _sheetList: Observable<any[]>;  // needed for edit-mode

    // component context
    private _sheetGroup: BehaviorSubject<any>;
    get sheetGroup(): any { return this._sheetGroup.value; }
    set sheetGroup(group: any) { this._sheetGroup.next(group); }

    private activeSheet: any;

    // solve memory leaks at the end
    private subscriptions: Subscription[];

    // view child
    @ViewChild(EntryTableComponent) private table$:EntryTableComponent;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private documentService: DocumentEditorService,
        private groupService: SheetGroupEditorService,
        private sheetService: SheetEditorService
    ){
        this.loading = true;
        this.subscriptions = [];
        this._sheetGroup = new BehaviorSubject(null);
        this._sheetList = Observable.from([]);
    }

    // Lifecycle Hooks
    ////////////////////////////////////////////////////////////////

    ngOnInit(): void {

        // extract URL parameters
        this.route.parent.params.first()
            .subscribe(
                param => {
                    this.documentService.getDocument(param['documentId'])
                        .first()
                        .subscribe( doc => this.document = doc );
                }
            )
        
        let subscription = this.route.params
                                .subscribe( 
                                    param => {
                                        this.initComponent(param['sheetGroupId']);
                                    } 
                                );
        this.subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        // unsubscribe all
        this.subscriptions.forEach( subscription => subscription.unsubscribe() );
    }


    // Component States
    ////////////////////////////////////////////////////////////////

    private initComponent(groupId: string): void {

        // console.log('init group detail component for group with ID: ', groupId );
        
        // load group
        let subscription =  this.groupService.getSheetGroup(groupId)
                                .subscribe(
                                    group => {
                                        if (group.$exists()) {
                                            this._sheetGroup.next(group);
                                            // setTimeout(function(){ this.loading = false; }.bind(this), 500);
                                            setTimeout( () => this.loading = false, 500);
                                        }
                                        // group not found
                                        /*if ( !group.$exists() && !this.removing) {
                                            console.log(`No object with ID-${groupId} could be found.`);

                                            // re-route to parent
                                            this.route.parent.url.first()
                                                .subscribe( 
                                                    urlSegments => this.router.navigate( urlSegments ) 
                                                );
                                            
                                            // this.router.navigate(['default', 'error-page'], {skipLocationChange: true});
                                        } else {
                                            // component context
                                            this._sheetGroup.next(group) 
                                            setTimeout(function(){ this.loading = false; }.bind(this), 500);
                                        }*/

                                    } 
                                );
        this.subscriptions.push(subscription);

        // load related sheets
        this._sheetList = this.sheetService.getSheetListByGroup(groupId);

        // clear active sheet before loading new
        this.activeSheet = undefined;
    }

    onTabChange(e: MdTabChangeEvent): void {
        this._sheetList.first().subscribe( 
            sheets => {
                this.activeSheet = sheets[e.index];
            }
        );
    }



    // Button Actions
    ////////////////////////////////////////////////////////////////

    /* SHEET GROUP */

    editSheetGroup(): void {
        this.sheetService.getSheetList(this.document.uid).first()
            .subscribe( 
                sheets => {
                    this.groupService.editSheetGroup(this.sheetGroup, sheets);
                }, 
                err => {
                    console.error('Error occured on open group form for editing.\n', err);
                    this.groupService.editSheetGroup(this.sheetGroup);
                }
            )
    }

    removeSheetGroup(): void {
        this.removing = true;
        this.groupService.removeSheetGroup(
            this.sheetGroup,
            () => {
                // redirect to parent
                this.router.navigate(['../..'], {relativeTo: this.route})
            }
        );
    }


    /* SHEET */

    addNewSheet(): void {
        let params = {
            documentId: this.document.uid,
            groupId: this.sheetGroup.uid
        }

        this.groupService.getSheetGroupList(this.document.uid).first()
            .subscribe( groups => this.sheetService.createSheet(groups, params) );
    }

    editActiveSheet(): void {
        this.groupService.getSheetGroupList(this.document.uid).first()
            .subscribe( 
                groups => {
                    this.sheetService.editSheet(
                        this.activeSheet, 
                        groups,
                        o => {  // callback
                            if (o.groupId !== this.activeSheet.groupId ) {
                                // redirect page if sheet has been moved to other group
                                this.router.navigate(['../../'], {relativeTo: this.route})
                            }
                        }
                    );
                }
            );
    }

    removeActiveSheet(): void {
        let sheet = this.activeSheet;   // temp variable
        this.sheetService.removeSheet(
            sheet, 
            () => {
                console.log( 'Sheet-"%s" has been removed.', sheet.name );
                this._sheetList.first()
                    .subscribe( 
                        // back to the first sheet
                        sheets => this.activeSheet = (sheets.length > 0) ? sheets[0]: null
                    );
            }
        );
    }


    /* ENTRY */

    addNewEntry(): void {
        this.table$.addNewEntry();
    }
}