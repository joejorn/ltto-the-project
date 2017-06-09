import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// modules
import { ConfirmModule } from './alert/alert.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { CoreRoutingModule } from './core-routing.module';
import { CoreMaterialModule } from './core-material.module';

// components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageDeniedComponent } from './default/page-denied.component';
import { PageErrorComponent } from './default/page-error.component';
import { PageFailedComponent } from './default/page-failed.component';

import { DummyComponent } from './dummy/dummy.component';

@NgModule({
	declarations: [
		HomeComponent,
		LoginComponent,
		PageDeniedComponent,
		PageErrorComponent,
		PageFailedComponent,
		DummyComponent
	],
	imports: [
		ConfirmModule.forRoot(),
		CommonModule,
		FormsModule,
		CoreMaterialModule,
		LoginRoutingModule,
		CoreRoutingModule
	],
})
export class CoreModule {}
