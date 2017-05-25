import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { AbstractDataService } from '../abstract/abstract-data.service';
import { EntryDataService } from '../entry/entry.service';
import { UserService } from '../../user/user.service';

import { DB_PATH_IDS } from '../../database-settings';

/*
Service provide APIs required for management of "sheets" and "sheet groups"
*/

@Injectable()
export class SheetDataService extends AbstractDataService {

    // internal constant
    private REF_PROPERTY_NAME: string = 'sheetId';

    constructor( 
        db: AngularFireDatabase, 
        userService: UserService, 
        private entryService: EntryDataService
    ) {
        super(db, userService);

        // init root path
        this.rootId = DB_PATH_IDS.root;

        // init context paths
        let ctxPath = DB_PATH_IDS.sheetPath;
        this.rootPathId = ctxPath.root;
        this.nestedPathId = ctxPath.nested;
        this.childPathIds = ctxPath.children;

    }


    /**
     * Context Function
     * *****************************
     */

    private extendObject( o: any ): Observable<any> {
        return  this.entryService.getObjectListByProperty(this.REF_PROPERTY_NAME, o.uid).first()
                    .map(
                        entries => {
                            o._entries = entries;
                            o.modified = Math.max( ...[o.modified].concat( entries.map( entry => entry.modified ) ) );
                            return o;
                        }
                    )
    }


    /**
     * QUERY APIs
     * *******************************
     */


    getObject( sheetId: string): FirebaseObjectObservable<any> {
        return this.db.object( this.rootPath + '/' + sheetId );
    }

    getObjectList( documentId: string = null ): FirebaseListObservable<Array<any>> {
        // console.log('get sheet list for document-', documentId);
        return this.db.list(this.rootPath, this._generateQueryByValue('documentId', documentId));
    }

    // query sheets corresponding to a certain sheet group
    getObjectListByProperty( propertyName: string, propertyValue: any ): FirebaseListObservable<Array<any>> {
        return this.db.list(this.rootPath, this._generateQueryByValue(propertyName, propertyValue));
    }


    // return sheet object including entries
    getExtendedObject( sheetId: string ): Observable<any> {
        return this.getObject(sheetId).switchMap( o => this.extendObject(o) );
    }


    getExtendedObjectList( sheetId: string = null): Observable<any> {
        return this.getObjectList(sheetId).switchMap( 
            (sheets) => {
                return Observable.forkJoin(
                    sheets.map( sheet => this.extendObject(sheet).first() )
                );
            }
        );
    }


    


    /**
     * I/O APIs
     * *******************************
     */

    add( o: any ): firebase.Promise<any> {
        let updates = {};

        //  self updates
        updates = Object.assign( updates, this._getSelfUpdates( o ) );
        let _self = updates[Object.keys(updates).pop()]; // get value in self_u

        //  nested updates
        if (_self.groupId) {
            let nestedPath = [this.nestedPathId, _self.groupId, 'members', _self.uid ].join('/');
            updates[nestedPath] = true;
        }

        // console.log('[SHEET][ADD] Updates: ', updates);
        return this.commitUpdates(updates, _self);
    }

    remove( o: any ): firebase.Promise<any> {

        let updates: Object = {};

        // self updates
        var self_path = [this.rootPathId, o.uid].join('/');
        updates[self_path] = null;
        
        //  nested updates
        if (o.groupId) {
            let nestedPath = [this.nestedPathId, o.groupId, 'members', o.uid].join('/');
            updates[nestedPath] = null;
        }
        
        // child updates
        return this.entryService.getObjectListByProperty( this.REF_PROPERTY_NAME, o.uid)
                .first()
                .toPromise()
                .then( 
                    entries => {    // on success
                        entries.forEach( (entry, index) => {
                            let _path = [this.childPathIds[0], entry.uid].join('/') 
                            updates[_path] = null;
                        } );
                        return this.commitUpdates(updates, o);
                    },
                    err => {    // on error
                        console.warn('Error occured on removing sheet: ', err);
                        return new Promise( (solved, reject) => reject(err) )
                    }
                )
    }


    update( prev:any, curr: any ): firebase.Promise<any> {
        let updates = {};

        //  self updates
        let merged = Object.assign( {}, prev, curr);
        updates = Object.assign( updates, this._getSelfUpdates( merged ) );
        let _self = updates[Object.keys(updates).pop()]; // updating object

        //  nested updates
        if (prev.groupId !== _self.groupId) {    // value of group ID has been changed

            if (!prev.groupId) {    // empty group -> non-empty group

                // assign the new membership
                let _path = [this.nestedPathId, _self.groupId, 'members', _self.uid].join('/');
                updates[_path] = true;

            } else if (!_self.groupId) {  // non-empty group -> empty group

                // remove the previous membership
                let _path = [this.nestedPathId, prev.groupId, 'members', prev.uid].join('/');
                updates[_path] = null;

            } else { // non-empty group -> non-empty group

                // remove previous membership
                let prevPath = [this.nestedPathId, prev.groupId, 'members', prev.uid].join('/');
                updates[prevPath] = null;
                
                // assign new membership
                let currPath = [this.nestedPathId, _self.groupId, 'members', _self.uid].join('/');
                updates[currPath] = true;

            }
        } 

        // console.log('[SHEET][EDT] Updates: ', updates);
        return this.commitUpdates(updates, _self);
    }

}