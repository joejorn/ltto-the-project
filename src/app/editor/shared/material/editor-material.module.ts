import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
        MdButtonModule,
        MdButtonToggleModule,
        MdCheckboxModule,
        MdDialogModule,
        MdInputModule, 
        MdIconModule, 
        MdListModule,
        MdMenuModule,
        MdOptionModule,
        MdProgressSpinnerModule,
        MdSelectModule,
        MdSidenavModule,
        MdTabsModule,
        MdToolbarModule,
    } from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdDialogModule,
    MdInputModule, 
    MdIconModule, 
    MdListModule,
    MdMenuModule,
    MdOptionModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
  ],
  exports: [
    MdButtonModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdDialogModule,
    MdInputModule, 
    MdIconModule, 
    MdListModule,
    MdMenuModule,
    MdOptionModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class EditorMaterialModule {}