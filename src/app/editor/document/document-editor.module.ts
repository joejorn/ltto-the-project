import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared-module/shared.module';
import { EditorSharedModule } from '../shared/editor-shared.module';

import { DocumentBrowserComponent } from './document-browser/document-browser.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { DocumentFormDialog } from './dialog/document-form.dialog';

import { SheetGroupEditorModule } from '../sheet-group/sheet-group-editor.module';
import { SheetEditorModule } from '../sheet/sheet-editor.module';

@NgModule({
    declarations: [
        DocumentFormDialog,
        DocumentBrowserComponent,
        DocumentDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        EditorSharedModule,
        SheetGroupEditorModule,
        SheetEditorModule
    ],
    entryComponents: [
        DocumentFormDialog
    ],
})

export class DocumentEditorModule {}