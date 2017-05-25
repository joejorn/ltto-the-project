import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialog } from './alert.dialog';
import { AlertMaterialModule } from './alert-material.module';
import { AlertService } from './alert.service';

@NgModule({
    declarations: [ AlertDialog ],
    imports: [ CommonModule, AlertMaterialModule ],
    exports: [ AlertDialog ],
    providers: [ AlertService ],
    entryComponents: [ AlertDialog ]
})

export class AlertModule {
    static forRoot(): ModuleWithProviders {
      return {
            	ngModule: AlertModule,
            	providers: [ AlertService ]
        	}
      }
}