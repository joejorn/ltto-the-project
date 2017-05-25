import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
        MdIconModule, 
        MdSelectModule,
        MdMenuModule,
        MdToolbarModule,
        MdListModule,
        MdButtonModule
    } from '@angular/material';

@NgModule({
  imports: [
    MdIconModule, 
    MdSelectModule,
    MdMenuModule,
    MdToolbarModule,
    MdListModule,
    MdButtonModule
  ],
  exports: [ 
    MdIconModule, 
    MdSelectModule,
    MdMenuModule,
    MdToolbarModule,
    MdListModule, 
    MdButtonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})

export class AppMaterialModule {}