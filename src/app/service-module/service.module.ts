import { NgModule, ModuleWithProviders } from '@angular/core';

import { DatabaseServiceModule } from './database/database-service.module';
import { AuthServiceModule } from './auth/auth-service.module';

@NgModule({
  imports: [
      AuthServiceModule.forRoot(),
      DatabaseServiceModule.forRoot()
  ],
})

export class ServiceModule {
    static forRoot(): ModuleWithProviders {
      return {
            	ngModule: ServiceModule,
            	providers: []
        	}
      }
}