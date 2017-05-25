import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared-module/shared.module';
import { EditorSharedModule } from './shared/editor-shared.module';
import { DocumentEditorModule } from './document/document-editor.module';

import { EditorGuard } from './editor.guard';
import { EditorRoutingModule } from './editor-routing.module';

import { EditorConsoleComponent } from './editor-console/editor-console.component';

@NgModule({
    declarations: [
		EditorConsoleComponent
    ],
	imports: [
		CommonModule,
		// FormsModule,
		SharedModule,
		EditorSharedModule,
		DocumentEditorModule,
        EditorRoutingModule
	],
	providers: [
		EditorGuard
	]
})
export class EditorModule {}
