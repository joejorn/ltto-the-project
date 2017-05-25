import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { VisualizationSharedModule } from '../../shared/visualization-shared.module';

import { DocumentSummaryComponent } from './document-summary/document-summary.component';
import { DocumentVisualizationComponent } from "./document-visualization/document-visualization.component";


@NgModule({
	imports: [ 
		CommonModule,
		VisualizationSharedModule
	],
  	declarations: [
		// public
    	DocumentSummaryComponent,
		DocumentVisualizationComponent
  	],
  	exports: [ 
		DocumentSummaryComponent,
		DocumentVisualizationComponent
	]
})

export class DocumentSummaryModule {
	
}
