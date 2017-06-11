import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { CONST_PATH_IDS } from '../../../../environments/environment';

import { IUser } from './user.interface';

@Injectable()
export class UserService {
    
    private user: BehaviorSubject<IUser>;

    public currentUser: Observable<IUser>;  // Subscribable

    constructor( public db: AngularFireDatabase ) {
        this.user = new BehaviorSubject(null);
        this.currentUser = this.user.asObservable();
        // this.currentUser.subscribe( usr => console.log('user changed: ', usr));
    }

    // cache user information
    public loadUser( userId: string ): Promise<IUser> {
        let configPath = [CONST_PATH_IDS.root, CONST_PATH_IDS.users, userId].join('/');
        return this.db.object(configPath).first()
            .toPromise()
            .then( 
                (usr: IUser) => {
                    this.user.next(usr);
                    return new Promise( resolve => resolve(usr) )
                },
                error => { 
                    console.log('Error on retrieving user: \n', error); 
                    return new Promise( (resolve, reject) => reject(error) );
                }
            );
    }

    public clear(): void {
        this.user.next(null);
    }

    public getUserRoles(): string[] { 
        let roles = [];
        let usr = this.user.getValue();
        if ( usr && usr.roles ) {
            roles = Object.keys(usr.roles).filter( (key:string) => usr.roles[key] === true );
        }
        return roles; 
    }

    public getCurrentUser(): IUser {
        return this.user.getValue();
    }


}

