import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { VisualizationFnService } from '../services/visualization-fn.service';
// temp
import { VisualizationDataService } from '../services/visualization-data.service';

import { DocumentDataService } from '../../../service-module/database/data/document/document.service'
import { SheetDataService } from '../../../service-module/database/data/sheet/sheet.service'
import { SheetGroupDataService } from '../../../service-module/database/data/sheet-group/sheet-group.service'
import { EntryDataService } from '../../../service-module/database/data/entry/entry.service'


@Injectable()
export class DocumentInfoListResolver implements Resolve<any[]> {
  
  constructor(
      private router: Router, 
      private dataService: VisualizationDataService
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.dataService.getDocuments().first();
  }
}