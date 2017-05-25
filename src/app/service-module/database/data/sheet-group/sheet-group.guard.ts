import { Injectable } from '@angular/core';
import {
        CanActivate, 
        CanActivateChild,
        ActivatedRouteSnapshot,
        Router,
        RouterStateSnapshot,
    } from '@angular/router';

import { SheetGroupDataService } from './sheet-group.service';
import { UserService } from '../../user/user.service';


@Injectable()
export class SheetGroupGuard implements CanActivate {
    
    constructor( 
        private router: Router, 
        private dataService: SheetGroupDataService, 
        private userService: UserService 
    ){}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Promise<boolean> {
        return this.isAvailable(route.params['sheetGroupId']);
    }


    isAvailable( documentId: string ): Promise<boolean> {
        return this.dataService.getObject(documentId).first()
                    .toPromise()
                    .then(
                        o => {
                            let redirect: string = '';
                            let user = this.userService.getCurrentUser();
                            if (!(
                                    user.roles['reviewer'] || 
                                    (user.roles['editor'] && o.creator === user.uid) 
                                )) {
                                redirect = 'page-denied';
                            } else if ( !o.$exists() ) {
                                redirect = 'page-not-found';
                            }
                            
                            let shouldRedirect = redirect.length > 0;
                            if (shouldRedirect) {
                                this.router.navigate([redirect], {skipLocationChange: true});
                            }

                            return new Promise( resolve => resolve(!shouldRedirect) );
                        }
                    ).catch ( 
                        error => {
                            console.log('Error on checking sheet group access: \n', error );
                            this.router.navigate(['/page-failed']);
                            return new Promise( resolve => resolve(false) )
                        } );
    }

}
