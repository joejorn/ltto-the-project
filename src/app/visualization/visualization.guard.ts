import { Injectable } from '@angular/core';
import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot
    } from '@angular/router';

import { UserService } from '../service-module/database/user/user.service';
import { IUser } from '../service-module/database/user/user.interface';


@Injectable()
export class VisualizationGuard implements CanActivate {
    
    constructor( private router: Router, private userService: UserService ){}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        let user = this.userService.getCurrentUser();
        return this.isAllowed( user);
    }

    isAllowed( user: IUser , callback?: any): boolean {

        let bool: boolean;
        if (user && user.roles['reviewer']) { 
            bool = true;
        } else {
            bool = false;
            this.router.navigate(['page-denied']);
        }

        return bool;
    }

}
