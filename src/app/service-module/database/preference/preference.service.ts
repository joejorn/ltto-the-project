import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs';

import { DB_PATH_IDS } from '../database-settings';

@Injectable()
export class PreferenceService {

    constructor(private db: AngularFireDatabase) {}

    public getPriceList(): Observable<any> {
        let configPath = [DB_PATH_IDS.root, DB_PATH_IDS.config, DB_PATH_IDS.priceList].join('/');
        return this.db.list(configPath);
    }

    // V1
    /*public getPriceCategories(): Observable<any[]> {
        return  this.getPriceList()
                    .map( 
                        prices => {
                            let lst = prices.map( price => price.category );
                            return Array.from(new Set(lst).values());
                        }
                    );
    }*/

    // V2
    public getPriceCategories(): Observable<any[]> {
        let configPath = [DB_PATH_IDS.root, DB_PATH_IDS.config, DB_PATH_IDS.priceCatgory].join('/');
        return this.db.list(configPath);
    }


    public getDetailedPriceCategories(): Observable<any[]> {
        let configPath = [DB_PATH_IDS.root, DB_PATH_IDS.config, DB_PATH_IDS.priceCatgory].join('/');
        return Observable.forkJoin(
                    this.getPriceList().first(),
                    this.getPriceCategories().first()
                ).map(
                    (values: any[]) => {
                        return values[1].map( 
                            cat => {
                                // set related prices into each category
                                cat.prices = values[0].filter( price => price.categoryId === cat.uid);
                                return cat;
                            }
                        );
                    }
                );
    }
}