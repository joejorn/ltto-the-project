import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared-module/shared.module';
import { EditorSharedModule } from '../shared/editor-shared.module';

import { SheetDetailComponent } from './sheet-detail/sheet-detail.component';
import { SheetFormDialog } from './dialog/sheet-form.dialog';
import { EntryEditorModule } from '../entry/entry-editor.module';

import { SheetGroupEditorModule } from '../sheet-group/sheet-group-editor.module';

@NgModule({
    declarations: [
        SheetDetailComponent,
        SheetFormDialog
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        EntryEditorModule,
        EditorSharedModule,
        SheetGroupEditorModule,
    ],
    entryComponents: [
        SheetFormDialog
    ],
})

export class SheetEditorModule {}