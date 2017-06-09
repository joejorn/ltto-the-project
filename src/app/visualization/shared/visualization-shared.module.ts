import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared-module/shared.module';
import { VisualizationMaterialModule } from './material/visualization-material.module';

// Service
import { VisualizationFnService } from './services/visualization-fn.service';
import { VisualizationDataService } from './services/visualization-data.service';

// Components
import { PriceListComponent } from './components/price-list/price-list.component';
import { PriceListDialog } from './components/dialog/price-list-dialog/price-list.dialog';
import { PriceTreeComponent } from './components/price-tree/price-tree.component';

// Pipes
import { ExtractValueFieldPipe } from './pipes/extractor.pipe';
import { LimitSizePipe } from './pipes/limitor.pipe';


@NgModule({
	imports: [ 
		CommonModule,
		SharedModule,
		VisualizationMaterialModule
	],
  	declarations: [
		PriceListComponent,
		PriceListDialog,
		PriceTreeComponent,
        ExtractValueFieldPipe,
		LimitSizePipe
  	],
  	exports: [ 
		SharedModule,
		PriceListComponent,
		PriceListDialog,
        PriceTreeComponent,
        ExtractValueFieldPipe,
		LimitSizePipe,
		VisualizationMaterialModule
	],
  	providers: [
    	VisualizationFnService,
		VisualizationDataService,
  	],
	entryComponents: [
		PriceListDialog
	]
})

export class VisualizationSharedModule { }
