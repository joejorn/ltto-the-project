import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// service module
import { AuthGuardService } from '../service-module/auth/auth-guard.service';
import { EditorGuard } from './editor.guard';

import { DocumentGuard } from '../service-module/database/data/document/document.guard';
import { DocumentResolver } from '../service-module/database/data/document/document.resolver';
import { SheetGuard } from '../service-module/database/data/sheet/sheet.guard';
import { SheetGroupGuard } from '../service-module/database/data/sheet-group/sheet-group.guard';

import { DocumentBrowserComponent } from './document/document-browser/document-browser.component';
import { DocumentDetailComponent } from './document/document-detail/document-detail.component';
import { SheetDetailComponent } from './sheet/sheet-detail/sheet-detail.component';
import { SheetGroupDetailComponent } from './sheet-group/sheet-group-detail/sheet-group-detail.component';

import { EditorConsoleComponent } from './editor-console/editor-console.component';

const EDT_ROUTES: Routes = [
  { 
    path: 'document', 
    canActivate:[
      AuthGuardService, 
      EditorGuard
    ],
    children: [
      { 
        path: '', 
        pathMatch: 'full', 
        component: DocumentBrowserComponent
      },
      { 
        path: ':documentId', 
        component: EditorConsoleComponent,
        canActivate:[DocumentGuard],
        children: [
          { path: '', component: DocumentDetailComponent },
          { path: 'sheet/:sheetId', component: SheetDetailComponent, canActivate:[SheetGuard] },
          { path: 'sheet-group/:sheetGroupId', component: SheetGroupDetailComponent, canActivate:[SheetGroupGuard] },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(EDT_ROUTES) ],
  exports: [ RouterModule ]
})

export class EditorRoutingModule {}