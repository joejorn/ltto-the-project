import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared-module/shared.module';
import { VisualizationMaterialModule } from './material/visualization-material.module';

// Service
import { VisualizationFnService } from './services/visualization-fn.service';
import { VisualizationDataService } from './services/visualization-data.service';

// Components
import { PriceListComponent } from './components/price-list/price-list.component';
import { PriceTreeComponent } from './components/price-tree/price-tree.component';

// Pipes
import { ExtractValueFieldPipe } from './pipes/extractor.pipe';
import { LimitSizePipe } from './pipes/limitor.pipe';

// Resolvers
import { DetailDocumentResolver } from './resolvers/detail-document.resolver'
import { DocumentInfoListResolver } from './resolvers/document-info-list.resolver'
import { PriceCategoriesResolver } from './resolvers/price-categories.resolver'
import { PriceInfoResolver } from './resolvers/price-info.resolver'

@NgModule({
	imports: [ 
		CommonModule,
		SharedModule,
		VisualizationMaterialModule
	],
  	declarations: [
		PriceListComponent,
		PriceTreeComponent,
        ExtractValueFieldPipe,
		LimitSizePipe
  	],
  	exports: [ 
		SharedModule,
		PriceListComponent,
        PriceTreeComponent,
        ExtractValueFieldPipe,
		LimitSizePipe,
		VisualizationMaterialModule
	],
  	providers: [
    	VisualizationFnService,
		VisualizationDataService,
        DetailDocumentResolver,
		DocumentInfoListResolver,
		PriceCategoriesResolver,
        PriceInfoResolver,
  	]
})

export class VisualizationSharedModule { }
