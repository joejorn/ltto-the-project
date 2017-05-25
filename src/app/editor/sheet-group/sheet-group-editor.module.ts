import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SheetGroupDetailComponent } from './sheet-group-detail/sheet-group-detail.component';
import { SheetGroupFormDialog } from './dialog/sheet-group-form.dialog';

import { EntryEditorModule } from '../entry/entry-editor.module';
import { EditorSharedModule } from '../shared/editor-shared.module';
import { SharedModule } from '../../shared-module/shared.module';


@NgModule({
    declarations: [
        SheetGroupFormDialog,
        SheetGroupDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        SharedModule,
        EditorSharedModule,
        EntryEditorModule,
    ],
    entryComponents: [
        SheetGroupFormDialog
    ],
})

export class SheetGroupEditorModule {}