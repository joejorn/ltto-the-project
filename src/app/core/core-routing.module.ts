import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { UserResolver } from '../service-module/database/user/user.resolver'; 
import { AuthGuardService } from '../service-module/auth/auth-guard.service'; 
import { PageErrorComponent } from './default/page-error.component';
import { PageDeniedComponent } from './default/page-denied.component';
import { PageFailedComponent } from './default/page-failed.component';
import { DummyComponent } from './dummy/dummy.component';
import { HomeComponent } from './home/home.component';


const CORE_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate:[AuthGuardService], resolve: {user: UserResolver} },
  // { path: 'overview', component: DummyComponent, canActivate:[AuthGuardService] },
  { path: 'page-not-found', component: PageErrorComponent },
  { path: 'page-failed', component: PageFailedComponent },
  { path: 'page-denied', component: PageDeniedComponent },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [ RouterModule.forChild(CORE_ROUTES) ],
  exports: [ RouterModule ]
})

export class CoreRoutingModule {}