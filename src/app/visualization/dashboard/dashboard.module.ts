import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VisualizationSharedModule } from '../shared/visualization-shared.module';

// Service
import { VisualizationFnService } from '../shared/services/visualization-fn.service';

// Chart
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { MetricChartComponent } from './charts/metric-chart/metric-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { PlotlyComponent } from './charts/plotly.component';
import { DashboardTileComponent } from './dashboard-tile/dashboard-tile.component';
import { DashboardComponent } from "./dashboard-component/dashboard.component";

@NgModule({
	imports: [ 
		CommonModule,
		VisualizationSharedModule
	],
  	declarations: [
		BarChartComponent,
		DashboardTileComponent,
		MetricChartComponent,
		PieChartComponent,
		PlotlyComponent,
		DashboardComponent
  	],
  	exports: [ 
		DashboardComponent
	],
  	providers: [
        VisualizationFnService
  	]
})

export class DashboardModule {}
