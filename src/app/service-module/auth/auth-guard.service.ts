import { Injectable } from '@angular/core';
import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivateChild
    } from '@angular/router';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
    
    constructor( private router: Router, private authService: AuthService ){}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        let url:string = state.url;
        return this.checkLogIn(url);
    }

    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        return this.canActivate( route, state );
    }

    checkLogIn( url: string ): boolean {
        if (this.authService.isLoggedIn) { 
            return true;
        }

        // If user has been logged in
        let cred = this.authService.getToken();
        if (cred) {
            
            this.authService.login(cred)
                .then( 
                    () => { 
                        console.log('pass to url: ', url);
                        this.router.navigate( [url] );
                    }
                );

        } else {

            this.authService.redirectUrl = url; // redirect after logging in
            this.router.navigate(['/login']);

        }

        return false;
    }

}
