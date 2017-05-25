import { NgModule, ModuleWithProviders } from '@angular/core';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';

@NgModule({
  providers: [
      AuthGuardService,
      AuthService
  ]
})

export class AuthServiceModule {
    static forRoot(): ModuleWithProviders {
      return {
            	ngModule: AuthServiceModule,
            	providers: [
                    AuthGuardService,
                    AuthService
                ]
        	}
      }
}