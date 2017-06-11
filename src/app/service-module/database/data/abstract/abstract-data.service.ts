import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { UserService } from '../../user/user.service';


@Injectable()
export class AbstractDataService {

    protected CREATE_LOG_PROP = 'created';
    protected MODIFY_LOG_PROP = 'modified';

    protected rootId: string;
    protected rootPath: string;
    protected _rootPathId: string;
    get rootPathId(): string { return this._rootPathId }
    set rootPathId(value: string) { // compute new root path
        this._rootPathId = value;
        this.rootPath = this.rootId + '/' + this._rootPathId;
    }

    // choose one
    // protected _nested: any[];
    protected nestedPathId: string;

    protected childPathIds: string[];

    constructor(
        protected db: AngularFireDatabase, 
        private userService: UserService
    ) {}

    protected _generateQueryByValue(prop: string, value: string): any {

        let _query:any;

        if (!value ||  value === '*') {
            _query = {
                        query: {
                            orderByChild: prop
                        }
                    };
        } else if (value) {
            _query = {
                        query: {
                            orderByChild: prop,
                            equalTo: value
                        }
                    };
            
        }
        return _query;
    }

    protected transformDashCase( txt: string ): string {
        let path: string = '';
        let words = txt.split('-').map( 
            (word, subIndex) =>  {
                let str = word;
                if (subIndex > 0) {
                    str = word.replace(
                                /(^[a-z]| [a-z]|-[a-z])/g,
                                $1 => $1.toUpperCase()
                            );
                }
                return str;
            }
        );

        // build a word
        return "".concat(...words);
    }


    /**
     * Helper functions for "Multi-Location" updates
     * **************************************************************
     */

    protected _getSelfUpdates(o: any, ignoreProperties?: string[]): any {
        // remove all unaccepted properties
        let _o = this._prepareObject(this.rootPath, o);

        // remove ignore properties
        if (ignoreProperties && ignoreProperties.length > 0) {
            Object.keys(_o).forEach(key => {
                if (ignoreProperties.indexOf(key) >= 0) {
                    delete _o[key];
                }
            })
        }


        let path = [this.rootPathId, _o.uid].join('/');
        let updates = {};
        updates[path] = _o;
        return updates;
    }


    // return new processed object
    protected _prepareObject(db_path: string, o: any) {

        if (!db_path || !o) return null;

        var _o = JSON.parse(JSON.stringify(o));    // new object

        var curr = Date.now();

        if (!_o.hasOwnProperty(this.CREATE_LOG_PROP)) {
            _o[this.CREATE_LOG_PROP] = curr;
        }

        // modified timestamp
        _o.modified = curr;

        if (!_o.uid && _o.hasOwnProperty('$key')) {
            _o.uid = _o['$key'];
            delete _o['$key'];
        } else if (!_o.uid && !_o.hasOwnProperty('$key')) {
            _o.created = curr;   // created-property
            _o.uid = this.db.list(db_path).push(null).key; // uid-property
            _o.creator = this.userService.getCurrentUser().uid;
        }

        this.minifyObject(_o);

        return _o;
    }

    // remove context properties / empty properties
    private minifyObject(o: any): void {

        Object.keys(o).forEach(p => {

            // recursive
            if (typeof(o[p]) === 'object' && o[p]!== null) {
                this.minifyObject(o[p]);
            
            } else if (!o[p] || p.startsWith('_') || p.startsWith('$') || (o[p] === '')) {
                delete o[p];

            }
            
        });
    }


    protected commitUpdates(updates: any, output?: any): firebase.Promise<any> {
        
        return  this.db.object(this.rootId)
                    .update(updates)
                    .then(
                        () => new Promise( (resolved) => resolved(output) ),
                        err => new Promise( (resolved, rejected) => rejected(err) )
                    );
    }

}


/*
    protected _lookUpValueByPath(obj: any, path: any) {
        path = path.split('.');
        for (let i = 0, len = path.length; i < len; i++) {
            obj = obj[path[i]];
        };
        return obj;
    };

    // remove this
    // generic function generating firebase's "updates"-object
    protected _getPropertyUpdates(targetPath: string, propertyPath: any, value: any, sourceRef?: any, valuePath?: any): any {

        // path
        let _path: string;
        if (propertyPath.constructor === Array) {
            _path = [targetPath].concat(propertyPath).join('/');

            // dynamic value in sub-path
            let _index = propertyPath.findIndex((elem: string) => elem.startsWith('$'));
            if (_index > -1) {    // property with dynamic value
                let propVar = propertyPath[_index];
                let prop = propVar.substring(1, propVar.length);    // extract property name
                _path = _path.replace(propVar, sourceRef ? sourceRef[prop] : '-');
            }

        } else if (propertyPath.constructor === String) {
            _path = [targetPath, propertyPath].join('/');

        } else {
            _path = targetPath;
        }

        // value
        let _value = (sourceRef && valuePath) ? this._lookUpValueByPath(sourceRef, valuePath) : value;

        return { path: _path, value: _value };
    }
*/