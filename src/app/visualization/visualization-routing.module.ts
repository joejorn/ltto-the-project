import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { DetailDocumentResolver } from './shared/resolvers/detail-document.resolver'
import { DocumentInfoListResolver } from './shared/resolvers/document-info-list.resolver';
import { PriceCategoriesResolver } from './shared/resolvers/price-categories.resolver'
import { PriceInfoResolver } from './shared/resolvers/price-info.resolver'

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
        canActivate:[AuthGuardService, VisualizationGuard], 
        resolve: { 
            documents: DetailDocumentResolver,
            prices: PriceInfoResolver
        }
    },
    { 
        path: 'summary', 
        component: DocumentSummaryComponent, 
        canActivate:[AuthGuardService, VisualizationGuard], 
        resolve: {
            documents: DocumentInfoListResolver,
            prices: PriceInfoResolver,  // @TODO: remove this
            priceCategories: PriceCategoriesResolver
        } 
    },
];

@NgModule({
  imports: [ RouterModule.forChild(VIS_ROUTES) ],
  exports: [ RouterModule ]
})

export class VisualizaitonRoutingModule {}