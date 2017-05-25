import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
        MdButtonModule,
        MdGridListModule,
        MdIconModule,
        MdListModule,
        MdMenuModule,
        MdProgressBarModule,
        MdSidenavModule,
    } from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdSidenavModule,
  ],
  exports: [
    MdButtonModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdSidenavModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class VisualizationMaterialModule {}