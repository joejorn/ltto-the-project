import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DocumentDataService } from './document.service';

@Injectable()
export class DocumentListResolver implements Resolve<any> {
  
  constructor( public router: Router, public dataService: DocumentDataService ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.dataService.getExtendedObjectList().first();
  }
}