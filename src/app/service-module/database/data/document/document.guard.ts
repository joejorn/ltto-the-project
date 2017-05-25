import { Injectable } from '@angular/core';
import {
        CanActivate, 
        CanActivateChild,
        ActivatedRouteSnapshot,
        Router,
        RouterStateSnapshot,
    } from '@angular/router';

import { DocumentDataService } from './document.service';
import { UserService } from '../../user/user.service';


@Injectable()
export class DocumentGuard implements CanActivate, CanActivateChild {
    
    constructor( private router: Router, private dataService: DocumentDataService, private userService: UserService ){}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Promise<boolean> {
        return this.isAvailable(route.params['documentId']);
    }

    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Promise<boolean> {
        return this.canActivate( route, state );
    }

    isAvailable( documentId: string ): Promise<boolean> {
        return this.dataService.getObject(documentId).first()
                    .toPromise()
                    .then(
                        doc => {
                            let redirect: string = '';

                            let user = this.userService.getCurrentUser();
                            if (!(  user.roles['reviewer'] || 
                                    (user.roles['editor'] && doc.creator === user.uid) 
                                )) {
                                redirect = 'page-denied';
                            } else if (!doc.uid) {
                                redirect = 'page-not-found'; 
                            }
                            let shouldRedirect = redirect.length > 0;
                            if (shouldRedirect) {
                                this.router.navigate(['/' + redirect]);
                            }

                            return new Promise( resolve => resolve(!shouldRedirect) );
                        }
                    ).catch ( 
                        error => {
                            console.log('[Guard] catching error: ', error );
                            this.router.navigate(['/page-failed']);
                            return new Promise( resolve => resolve(false) )
                        } );
    }

}
