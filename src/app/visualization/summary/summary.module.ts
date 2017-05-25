import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DocumentSummaryModule } from './document/document-summary.module';


@NgModule({
	imports: [ 
		CommonModule,
		DocumentSummaryModule
	]
})

export class SummaryModule { }
