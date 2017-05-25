import { Component, OnInit, OnDestroy, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { Observable, Subscription } from 'rxjs';

// services
import { DocumentEditorService } from '../shared/services/document/document-editor.service';
import { SheetEditorService } from '../shared/services/sheet/sheet-editor.service';
import { SheetGroupEditorService } from '../shared/services/sheet-group/sheet-group-editor.service';

@Component({
  selector: 'ltto-editor-console',
  templateUrl: 'editor-console.component.html',
  styleUrls: ['editor-console.component.css']
})

export class EditorConsoleComponent implements OnInit, AfterViewInit, OnDestroy {

	private loading: boolean;

	document: Observable<any>;
	sheetList : Observable<any[]>;  // only non-group sheets
	sheetGroupList : Observable<any[]>;

	@ViewChild(MdSidenav) private sideNav: MdSidenav;

	private subscriptions: Subscription[];

	constructor( 
		private docService: DocumentEditorService,
		private sheetService: SheetEditorService,
		private sheetGroupService: SheetGroupEditorService,
		private route: ActivatedRoute,	// url parser
		private router: Router,
		private _ngZone: NgZone	// tracking window size
	) {
		this.loading = true;
		this.subscriptions = [];
	}


	ngOnInit(): void {

		let subscription = 	this.route.params
								.subscribe( 
									params => {
										if (params.hasOwnProperty('documentId')) {
											this.initComponent(params['documentId']);
										}
									}
								);
		this.subscriptions.push(subscription);

		// Temporary solution for responsive side bar
		window.onresize = (e) => this._ngZone.run( () => this.initSideBar() );
		// this._ngZone.run( () => this.initSideBar() );

	}

	ngAfterViewInit(): void {
		this._ngZone.run( () => this.initSideBar() );
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach( subscription => subscription.unsubscribe() );
	}

	initComponent(docId: string) {

		this.document = this.docService.getDocument(docId);
		this.sheetList = this.sheetService.getSheetList(docId);
		this.sheetGroupList = this.sheetGroupService.getSheetGroupList(docId);

		// set console service
		this.document.first().subscribe( doc => {

			// not found
			if (!doc.$exists()) {
				this.router.navigate(['default', 'error-page'], {skipLocationChange: true});
			} else {
				this.loading = false;
			}

		} );
	}

	private initSideBar(): void {
		if (window.innerWidth > 768) {
			this.sideNav.open();
		} else {
			this.sideNav.close();
		}
	}

}