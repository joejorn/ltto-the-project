import { NgModule, ModuleWithProviders } from '@angular/core';

import { PreferenceService } from './preference/preference.service';

import { AbstractDataService } from './data/abstract/abstract-data.service';

import { DocumentDataService } from './data/document/document.service';
import { DocumentGuard } from './data/document/document.guard';
import { DocumentResolver } from './data/document/document.resolver';

import { SheetDataService } from './data/sheet/sheet.service';
import { SheetGuard } from './data/sheet/sheet.guard';
import { SheetGroupDataService } from './data/sheet-group/sheet-group.service';
import { SheetGroupGuard } from './data/sheet-group/sheet-group.guard';
import { EntryDataService } from './data/entry/entry.service';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';

@NgModule({
  imports: [],
  providers: [
    AbstractDataService, 
    DocumentDataService, DocumentGuard, DocumentResolver,
    SheetDataService, SheetGuard,
    SheetGroupDataService, SheetGroupGuard,
    EntryDataService,
    UserService, UserResolver, 
    PreferenceService
  ]
})

export class DatabaseServiceModule {
    static forRoot(): ModuleWithProviders {
      return {
            	ngModule: DatabaseServiceModule,
            	providers: [
                AbstractDataService, 
                DocumentDataService, 
                DocumentGuard, DocumentResolver,
                SheetDataService, 
                SheetGroupDataService, 
                EntryDataService, 
                PreferenceService,
                UserService, UserResolver
              ]
        	}
      }
}