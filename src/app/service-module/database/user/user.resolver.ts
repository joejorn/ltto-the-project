import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { IUser } from './user.interface';

@Injectable()
export class UserResolver implements Resolve<IUser> {
  
  constructor( public router: Router, public userService: UserService ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
    // console.log('resolving user...');
    return this.userService.currentUser.first();
  }
}