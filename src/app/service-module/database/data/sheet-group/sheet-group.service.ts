import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { AbstractDataService } from '../abstract/abstract-data.service';
import { SheetDataService } from '../sheet/sheet.service';
import { EntryDataService } from '../entry/entry.service';
import { UserService } from '../../user/user.service';

import { DB_PATH_IDS } from '../../database-settings';

// import { SheetGroup } from '../models/sheet-group.model';

@Injectable()
export class SheetGroupDataService extends AbstractDataService {

    // internal constant
    public REF_PROPERTY_NAME: string = 'groupId';


    constructor( 
        db: AngularFireDatabase, 
        userService: UserService, 
        private sheetService: SheetDataService, 
        private entryService: EntryDataService
    ) {
        super(db, userService);

        // init root path
        this.rootId = DB_PATH_IDS.root;

        // init context paths
        let ctxPath = DB_PATH_IDS.sheetGroupPath;
        this.rootPathId = ctxPath.root;
        this.nestedPathId = ctxPath.nested;
        this.childPathIds = ctxPath.children;
    }


    /**
     * Context Function
     * *****************************
     */

    private extendObject( o: any ): Observable<any> {

        // return observable objects within a group
        let memberFn = o => {
            var _o = [];
            if (o.hasOwnProperty('members'))
                _o = Object.keys(o.members).map(
                    member => this.sheetService.getExtendedObject(member).first() 
                );
            return _o;
        };

        if (!o.members) {
            o._sheets = [];
            return Observable.from( [o] );
        } else
            return Observable.forkJoin(

                memberFn(o).filter( o => o !== null && o !== undefined ),
                
                (...sheets:any[]) => {
                    o._sheets = sheets;
                    o._entryNumber = o._sheets.map( sheet => sheet._entries.length )
                                            .reduce( (a,b) => a + b, 0);
                    o.modified = Math.max( ...[o.modified].concat( sheets.map( sheet => sheet.modified ) ) );
                    return o;
                }
            ) // end: fork join
    }



    /* 
     * Retrieval APIs
     * ****************************************************************
     */

    getObject( groupId: string): FirebaseObjectObservable<any> {
        return this.db.object(this.rootPath + '/' + groupId);
    }

    getObjectList( documentId: string = null ): FirebaseListObservable<Array<any>> {
        return this.db.list(this.rootPath, this._generateQueryByValue('documentId', documentId));
    }

    getExtendedObject( groupId: string) : Observable<any> {
        return  this.getObject(groupId).switchMap( group => this.extendObject(group) )   
    }

    getExtendedObjectList( documentId: string = null): Observable<any> {
        // console.log(`Get extended sheet groups for document-"${documentId}"`);
        return this.getObjectList(documentId).switchMap( 
            (groups) => {
                return Observable.forkJoin(
                    groups.map( group => this.extendObject(group).first() )
                )
            }
        );
    }

    

    /**
     * I/O APIs
     * **************************************************************
     */

    add(o: any): firebase.Promise<any> {

        let updates = {};

        // self update
        updates = Object.assign(updates, this._getSelfUpdates( o ) );
        let _group = updates[Object.keys(updates).pop()]; // get value in self_u

        // nested updates
        Object.keys(o.members).forEach(
            memberId => {
                let _path = [ this.nestedPathId, memberId, this.REF_PROPERTY_NAME ].join('/');
                updates[_path] = _group.uid;
            }
        )

        return  this.commitUpdates(updates, _group);
    }

    remove(o: any, forceRemove: boolean = true): firebase.Promise<any> {
        
        let updates = {};

        // self update
        var self_path = [this.rootPathId, o.uid].join('/');
        updates[self_path] = null;

        // nested updates
        let members = [];
        if (o.members) {
            members = Object.keys(o.members);
            members.forEach(
                member => {
                    let _path = [ this.nestedPathId, member ].join('/');
                    if (!forceRemove)  // remove all
                        updates[_path + '/' + this.REF_PROPERTY_NAME] = null;
                    else    // remove only linking
                        updates[_path] = null;
                }
            )
        }
        
        if (!forceRemove || members.length < 1)  
            // no child updates
            return  this.commitUpdates(updates, o);

        else
            // child updates - remove entries
            return Observable.forkJoin(
                            members.map(
                                member => 
                                    this.entryService.getObjectListByProperty('sheetId', member).first()
                            ),
                            values => this.flattenFn(values)
                        )
                    .toPromise()
                    .then( entries => {

                        entries.forEach( entry => {
                            let _path = [this.childPathIds[0], entry.uid].join('/');
                            updates[_path] = null;
                        })
 
                        return  this.commitUpdates(updates, o);
                    })
    }

    update(prev: any, curr: any): firebase.Promise<any> {
        let updates = {};

        // self update
        updates = Object.assign(updates, this._getSelfUpdates( curr ) );
        let _group = updates[Object.keys(updates).pop()]; // get value in self_u
        
        // nested update due to changes
        // use negated values of previous members for change detections
        let negates = {};
        for (let prop in prev.members) {
            negates[prop] = !prev.members[prop];
        }

        let _changes = Object.assign({}, negates, _group.members );
        for (let memberId in _changes) {
            let _value = _changes[memberId] === true ? _group.uid : null;  // remove it or set new value
            let _path = [this.nestedPathId, memberId, this.REF_PROPERTY_NAME].join('/'); 
            updates[_path] = _value;
            // let update = this._getPropertyUpdates(_path, this.REF_PROPERTY_NAME, _value);
            // updates[update.path] = update.value;
        }

        return  this.commitUpdates(updates, _group);
    }


    /**
     * Helper function to flatten a complex array
     * **************************************************************
     */
    private flattenFn(arr): any[] {
        return arr.reduce(
            (a, b) => a.concat(Array.isArray(b) ? this.flattenFn(b) : b)
            , []
        );
    }
}