import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { DashboardComponent } from './dashboard/dashboard-component/dashboard.component';
import { DocumentSummaryComponent } from './summary/document/document-summary/document-summary.component';

// Guard
import { AuthGuardService} from '../service-module/auth/auth-guard.service';
import { VisualizationGuard } from './visualization.guard';


const VIS_ROUTES: Routes = [
    { 
        path: 'overview', 
        component: DashboardComponent, 
        canActivate:[AuthGuardService, VisualizationGuard]
    },
    { 
        path: 'summary', 
        component: DocumentSummaryComponent, 
        canActivate:[AuthGuardService, VisualizationGuard], 
    },
];

@NgModule({
  imports: [ RouterModule.forChild(VIS_ROUTES) ],
  exports: [ RouterModule ]
})

export class VisualizaitonRoutingModule {}