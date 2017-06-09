import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from './alert.dialog';
import { ConfirmMaterialModule } from './alert-material.module';
import { ConfirmService } from './alert.service';

@NgModule({
    declarations: [ ConfirmDialog ],
    imports: [ CommonModule, ConfirmMaterialModule ],
    exports: [ ConfirmDialog ],
    providers: [ ConfirmService ],
    entryComponents: [ ConfirmDialog ]
})

export class ConfirmModule {
    static forRoot(): ModuleWithProviders {
      return {
            	ngModule: ConfirmModule,
            	providers: [ ConfirmService ]
        	}
      }
}