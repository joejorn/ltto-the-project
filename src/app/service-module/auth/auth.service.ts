import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { UserService } from '../database/user/user.service';

@Injectable()
export class AuthService {
    
    isLoggedIn: boolean = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor( private afAuth: AngularFireAuth, private userService: UserService ) {}

    login(credential: IUserCredential): firebase.Promise<firebase.User> {
        return this.afAuth.auth.signInWithEmailAndPassword(
                    credential.email, 
                    credential.password 
                ).then(
                    (authState) => {
                        this.isLoggedIn = true;
                        // console.log('auth state: ', authState);
                        if (credential.checked) {
                            this.setToken(credential);
                        }
                        return this.userService.loadUser(authState.uid);
                        // return new Promise( (resolve) => resolve(success) );
                    }
                ).catch(
                    (error) => new Promise( (resolve, reject) => reject(error))
                );
    }

    logout(): firebase.Promise<any> {
        // if (this.isLoggedIn) {
        return this.afAuth.auth.signOut()
                    .then( 
                        () => { 
                            this.isLoggedIn = false;
                            this.userService.clear();
                            this.removeToken();
                            return new Promise( resolve => resolve() );
                        } 
                    )
                    .catch( 
                        (error) => { 
                            console.log('log out failed: \n', error)
                            return new Promise( (resolve, reject) => reject(error) );
                        } 
                    );
        // }
    }


    // store token
    setToken(credential: IUserCredential) {
        // TODO: encrypt the token!
        if (credential.checked) {
            let storageKey = 'fire-credential';
            localStorage.setItem( storageKey, JSON.stringify(credential) );
        }
    }

    removeToken(): void {
        localStorage.removeItem('fire-credential');
    }

    getToken(): IUserCredential {
        // TODO: decrypt the token!
        let credStr = localStorage.getItem('fire-credential');
        return (credStr && credStr.length > 0) ? JSON.parse(credStr): null;
    }
}

interface IUserCredential {
    email: string;
    password: string; 
    checked?: boolean;
}