import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardModule } from './dashboard/dashboard.module';
import { SummaryModule } from './summary/summary.module'
import { VisualizaitonRoutingModule } from './visualization-routing.module';

import { VisualizationGuard } from './visualization.guard';


@NgModule({
	imports: [ 
		CommonModule,
		DashboardModule,
		SummaryModule,
		VisualizaitonRoutingModule
	],
	providers: [
		VisualizationGuard
	]
})

export class VisualizationModule { }
