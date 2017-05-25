import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
        MdButtonModule,
        MdButtonToggleModule,
        MdDialogModule,
        MdInputModule, 
        MdIconModule, 
        MdToolbarModule
    } from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdButtonToggleModule,
    MdDialogModule,
    MdInputModule, 
    MdIconModule,
    MdToolbarModule
  ],
  exports: [
    MdButtonModule,
    MdButtonToggleModule,
    MdDialogModule,
    MdInputModule, 
    MdIconModule,
    MdToolbarModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class EntryMaterialModule {}