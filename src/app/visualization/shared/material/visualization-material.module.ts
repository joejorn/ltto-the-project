import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
        MdButtonModule,
        MdGridListModule,
        MdIconModule,
        MdListModule,
        MdMenuModule,
        // MdProgressBarModule,
        MdProgressSpinnerModule,
        MdSidenavModule,
        MdToolbarModule
    } from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdMenuModule,
    // MdProgressBarModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdToolbarModule
  ],
  exports: [
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdMenuModule,
    // MdProgressBarModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdToolbarModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class VisualizationMaterialModule {}