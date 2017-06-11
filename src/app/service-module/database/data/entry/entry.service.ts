import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AbstractDataService } from '../abstract/abstract-data.service';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs/Observable';

import { DB_PATH_IDS } from '../../database-settings';

/*
    Service provide APIs required for management of entries
*/

@Injectable()
export class EntryDataService extends AbstractDataService {

    private priceList: FirebaseObjectObservable<any>;

    constructor(db: AngularFireDatabase, userService: UserService) {
        super(db, userService);

        // init paths
        this.rootId = DB_PATH_IDS.root;
        this.rootPathId = DB_PATH_IDS.entryPath.root;
    }



    /**
     * QUERY APIs
     * *******************************
     */

    getObject( entryId: string ): FirebaseObjectObservable<any> {
        return this.db.object( this.rootPath + '/' + entryId );
    }

    getObjectByProperty( propertyName: string, propertyValue: any ): FirebaseObjectObservable<any> {
        return this.db.object(this.rootPath, this._generateQueryByValue(propertyName, propertyValue));
    }

    getObjectListByProperty( propertyName: string, propertyValue: any ): FirebaseListObservable<any[]> {
        return this.db.list(this.rootPath, this._generateQueryByValue(propertyName, propertyValue));
    }


    /**
     * I/O APIs
     * *****************************
     */

    add( o: any ): firebase.Promise<any> {

        let _o = this._prepareObject(this.rootPath, o);
        let _path = [this.rootPath, _o.uid].join('/');

        // console.log(`[ADD][Entry] Entry with title "${_o.name}" has been added.`);
        return this.db.object(_path).set(_o);
    }


    remove( o: any ): firebase.Promise<any> {
        
        let _path = [this.rootPath, o.uid].join('/');

        // console.log(`Entry with title "${o.name}" has been removed.`);
        return this.db.object(_path).set(null);
    }


    update(prev: any, curr: any): firebase.Promise<any> {

        let _o = this._prepareObject(this.rootPath, curr);
        let _path = [this.rootPath, curr.uid].join('/');

        // console.log(`[EDT][Entry]"${_o.name}"-Entry has been updated`);
        return this.db.object(_path).set(_o);
    }

}