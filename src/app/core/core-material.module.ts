import { NgModule } from '@angular/core';
import {
        MdCheckboxModule, 
        MdInputModule, 
        MdIconModule, 
        MdButtonModule
    } from '@angular/material';

@NgModule({
  imports: [
    MdCheckboxModule, 
    MdInputModule, 
    MdIconModule, 
    MdButtonModule
  ],
  exports: [
    MdCheckboxModule, 
    MdInputModule, 
    MdIconModule, 
    MdButtonModule
  ]
})

export class CoreMaterialModule {}