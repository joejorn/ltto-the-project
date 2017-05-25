import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// firebase
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// services
import { AbstractDataService } from '../abstract/abstract-data.service';
import { UserService } from '../../user/user.service';

// config
import { DB_PATH_IDS } from '../../database-settings';



@Injectable()
export class DocumentDataService extends AbstractDataService  {

    constructor(
        db: AngularFireDatabase, 
        userService: UserService,
    ) {
        super(db, userService);

         // init root path
        this.rootId = DB_PATH_IDS.root;

        // init context paths
        let ctxPath = DB_PATH_IDS.documentPath;
        this.rootPathId = ctxPath.root;
        this.childPathIds = ctxPath.children;
    }

    /**
     * Context Function
     * *****************************
     */

    private extendObject( o: any ): Observable<any> {

        return Observable.forkJoin(
                
                // queries for all children
                this.childPathIds.map( childPathId => {
                    let query = this._generateQueryByValue('documentId', o.uid);
                    return this.db.list( `${this.rootId}/${childPathId}`, query).first();
                })

            ).switchMap(
                values => {

                    this.childPathIds.forEach( 
                        (pathId:string, index:number, arr:any[]) => {
                            let path: string = pathId;

                            // transform dash-case
                            if (pathId.includes('-')) {
                                path = this.transformDashCase( pathId );
                            }
                            o['_' + path] = values[index];
                        }
                    );
                    return Observable.from([o]);
                }
            );
    }
    

    /**
     * APIs for accessing
     * *****************************
     */

    // get stored document object
    getObject(_id: string): FirebaseObjectObservable<any> {
        return this.db.object(this.rootPath + '/' + _id);
    }


    getObjectList(creatorId?: string): FirebaseListObservable<any> {
        let o: FirebaseListObservable<any>;
        if (creatorId) {
            let query = this._generateQueryByValue('creator', creatorId);
            o = this.db.list( this.rootPath, query );
        } else {
            o = this.db.list( this.rootPath);
        }
        return o;
    }

    getExtendedObject(documentId: any): Observable<any> {
        return this.getObject(documentId).switchMap( doc => this.extendObject(doc) );
    }

    getExtendedObjectList(creatorId?: string): Observable<any> {
        return this.getObjectList(creatorId).switchMap( 
            (docs) => {
                return Observable.forkJoin(
                    docs.map( doc => this.extendObject(doc).first() )
                );
            }
        );
    }


    /**
     * APIs for Manipulation
     * *****************************
     * */

    add( o: any ): firebase.Promise<any> {

        let _o = this._prepareObject(this.rootPath, o);
        let _path = [this.rootPathId, _o.uid].join('/');

        console.log(`Add document with name "${_o.name}".`);

        let updates = {};
        updates[_path] = _o;
        console.log('[DOC][ADD] updates: ', updates);
        // return new Promise( resolved => resolved( update ) );

        // commit
        // return this.db.object(_path).set(_o);
        return this.commitUpdates(updates, _o)
    }


    // Recursive deletion: documents -> sheets & sheet-groups -> entries
    remove( o: any ): firebase.Promise<any> {
        
        // remove all sheet groups, sheets and entries
        var updates = {};
        var _docPath = this.rootPathId + '/' + o.uid;
        updates[_docPath] = null;

        return Observable.forkJoin(

                // queries for all children
                this.childPathIds.map( childPathId => {
                    let query = this._generateQueryByValue('documentId', o.uid);
                    return this.db.list( `${this.rootId}/${childPathId}`, query).first();
                })

            )
            .timeout(2000)
            .toPromise()
            .then(
                values => {
                    
                    this.childPathIds.forEach( 
                        (childPathId:string, index:number) => {
                            let lst = values[index] as any[];
                            lst.forEach( item => {
                                updates[`${childPathId}/${item.uid}`] = null;   // remove item by "null"-assigning
                            });
                        }
                    )

                    // commit
                    // return this.db.object(this.rootId).update(updates);
                    // return new Promise( resolved => resolved( updates ) );
                    return this.commitUpdates(updates, o);
                },
                err => {
                    console.error('Error occured on removing document:\n', err);
                    return new Promise( (resolved, rejected) => rejected( err ) );
                    // return this.commitUpdates(updates, o);
                }
            );

    }


    update(prev: any, curr: any): firebase.Promise<any> {

        let _o = this._prepareObject(this.rootPath, curr);
        let _path = [this.rootPathId, curr.uid].join('/');
        console.log(`Document with name "${curr.name}" has been updated.`);

        let updates = {};
        updates[_path] = _o;
        console.log('[DOC][EDT] updates: ', updates);
        // return new Promise( resolved => resolved( updates ) );

        // commit
        // return this.db.object(_path).set(_o);
        return this.commitUpdates(updates, _o)
    }

}




/*

/*
    let subPaths = pathId.split('-');
    subPaths = subPaths.map( 
        (subPath, subIndex) =>  {
            let str = subPath
            if (subIndex > 0) {
                str = subPath.replace(
                            /(^[a-z]| [a-z]|-[a-z])/g,
                            $1 => $1.toUpperCase()
                        );
            }
            return str;
        }
    );

    path = "".concat(...subPaths); // build word


// Version 1:

private extendObject( o: any ): Observable<any> {

    return Observable.forkJoin(
            
            // queries for all children
            this.childPathIds.map( childPathId => {
                let query = this._generateQueryByValue('documentId', o.uid);
                return this.db.list( `${this.rootId}/${childPathId}`, query).first();
            })

        ).switchMap(
            values => {

                let recent = 0; // recent timestamp

                // iterate from tail to head
                this.childPathIds.forEach( (path:string, index:number, arr:any[]) => {
                    let _index = arr.length - 1 - index;
                    if (_index < 1) {  // sheet group

                        // assign sheets to group
                        values[_index].forEach( group => {
                            group._sheets = values[_index + 1].filter(
                                                sheet => sheet.groupId === group.uid
                                            );
                            group.modified = Math.max( ...group._sheets.map( entry => entry.modified ) )
                            recent = group.modified > recent ? group.modified : recent;
                        });

                        // assign sheet groups to document
                        o._sheetGroups = values[_index];

                    } else if (_index < 2) {   // sheet

                        // assign entries to sheet
                        values[_index].forEach( sheet => {
                            sheet._entries = values[_index + 1].filter( 
                                                entry => entry.sheetId === sheet.uid
                                            );
                            sheet.modified = Math.max( ...sheet._entries.map( entry => entry.modified ) )
                            recent = sheet.modified > recent ? sheet.modified : recent;
                        });
                        
                        // assign sheets to document
                        o._sheets = values[_index].filter( (sheet:Object) => !sheet.hasOwnProperty('groupId') );

                    } else {    // entries

                        // update sheet timestamp
                        let timestamp = Math.max( ...values[_index].map( item => item.modified ) );
                        recent = timestamp > recent ? timestamp : recent;
                        
                    }

                });

                o.modified = recent;

                return Observable.from([o]);
            }
        )

}


*/