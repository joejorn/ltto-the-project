import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs'

import { PreferenceService } from '../../../service-module/database/preference/preference.service';

@Injectable()
export class PriceInfoResolver implements Resolve<any[]> {
  
  constructor(private router: Router, private prefService: PreferenceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.prefService.getPriceList().first();
  }
}