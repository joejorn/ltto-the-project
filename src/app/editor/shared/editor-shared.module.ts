import { NgModule } from '@angular/core';

import { DocumentEditorService } from './services/document/document-editor.service';
import { SheetGroupEditorService } from './services/sheet-group/sheet-group-editor.service';
import { SheetEditorService } from './services/sheet/sheet-editor.service';

import { EditorMaterialModule } from './material/editor-material.module';


@NgModule({
    imports: [
        EditorMaterialModule
    ],
    exports: [
        EditorMaterialModule
    ],
    providers: [
        DocumentEditorService, 
        SheetGroupEditorService,
        SheetEditorService
    ],
})

export class EditorSharedModule {}