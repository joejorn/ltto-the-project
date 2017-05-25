import { Injectable } from '@angular/core';
import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot
    } from '@angular/router';

import { UserService } from '../service-module/database/user/user.service';
import { IUser } from '../service-module/database/user/user.interface';


@Injectable()
export class EditorGuard implements CanActivate {
    
    constructor( private router: Router, private userService: UserService ){}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        let user = this.userService.getCurrentUser();
        return this.isEditor( user);
    }

    isEditor( user: IUser , callback?: any): boolean {

        let bool: boolean;
        if (user && user.roles['editor']) { 
            bool = true;
        } else {
            bool = false;
            this.router.navigate(['page-denied']);
        }

        return bool;
    }

}
