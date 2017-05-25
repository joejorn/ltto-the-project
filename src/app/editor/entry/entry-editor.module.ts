import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EntryTableComponent } from './entry-table/entry-table.component';
import { EntryFormDialog } from './dialog/entry-form.dialog';
import { EntryEditorService } from './service/entry-editor.service';

import { EditorSharedModule } from '../shared/editor-shared.module';
import { EntryMaterialModule } from './entry-material.module';

import { CountVisibleCellPipe, SetVisibleCellPipe } from './pipes/cell.pipe';

@NgModule({
    declarations: [
        EntryTableComponent,
        EntryFormDialog,
        CountVisibleCellPipe,
        SetVisibleCellPipe
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        EntryMaterialModule,
    ],
    exports: [
        EntryTableComponent
    ],
    providers: [
        EntryEditorService
    ],
    entryComponents: [
        EntryFormDialog
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class EntryEditorModule {}