import { NgModule } from '@angular/core';
import {
        MdDialogModule, 
        MdButtonModule
    } from '@angular/material';

@NgModule({
  imports: [
    MdDialogModule,
    MdButtonModule
  ],
  exports: [
    MdDialogModule,
    MdButtonModule
  ]
})

export class AlertMaterialModule {}