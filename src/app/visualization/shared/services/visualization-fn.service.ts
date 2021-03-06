import { Injectable } from '@angular/core';

/*
Service provide APIs required for management of "sheets" and "sheet groups"
*/

@Injectable()
export class VisualizationFnService {

    // overall sum of entries
    getEntrySum( entries: any[] = [] ): Number {
        // console.log('get sum for entries with length: ', entries.length );
        return entries.reduce( (prev, curr) => {    // each entry
                    let val = 0;
                    if (curr.prices) {
                        val = Object.keys(curr.prices).reduce( // each entry's price
                                    (_prev, currKey) => {
                                        let num = Number( curr.prices[currKey] );
                                        return (!isNaN(num)) ? _prev + num : _prev;
                                    }, 0);
                    }
                    // console.log( `sum of "${prev}" + "${val}" = ${prev + val}` );
                    return  prev + val;
                }, 0 )
    }


    // overall sum of categories
    getCategorySum( categorySum: any[] = [] ): number {
        return categorySum.reduce( (a,b) => (b.value) ? a + b.value : a, 0  );
    }


    // sum of entries by price
    getSumByPrice( prices: any[], entries: any[] = [] ): any[] {
        return prices.map( 
            price => {
                price.value = entries.reduce( 
                                (prev, curr) => {
                                    let val = 0;
                                    if (curr.prices) {
                                        val = Number( curr.prices[price.property] );
                                    }

                                    return (!isNaN(val)) ? prev + val : prev;
                                }
                                , 0 );
                // console.log('--> property: "%s" \t sum: "%s"', price.property, price.sum );
                return price;
            }
        );

    }

    // sum of prices by (detailed) category
    getSumByPriceCategory( categories: any[], entries?: any[], grossOnly: boolean = false): any[] {
        let prices = categories.reduce( (a: any[], b: any) => a.concat( b.prices ), [] );

        let sumPrices = entries ? this.getSumByPrice( prices, entries ) : prices ;
        let catSums = categories.map(
                            cat => {
                                // related prices
                                let filteredPrices = sumPrices.filter( price => price.categoryId === cat.uid );

                                // sum
                                let sum = filteredPrices.reduce( (prev, curr) => {
                                                    let val = Number(curr.value);
                                                    return ( !isNaN(val) ) ? prev + val: prev;
                                                }, 0 );
                                
                                let catSum = { name: cat.name, value: sum };
                                
                                // multiplied value of sum
                                if (!grossOnly && cat.hasOwnProperty('multiplier')) {
                                    let abs_factor = sum < 0 ? sum * -1 : sum;  // absolute value
                                    catSum['multiplier'] = {
                                        factor: cat.multiplier,
                                        value: abs_factor * cat.multiplier
                                    };
                                }
                                return catSum;
                            }
                        );

        return catSums;
    }


    getSumByDocument( documents: any[], entries: any[] = []) {
        if (!documents) {
            return undefined;
        }

        documents.forEach(
            doc => {
                let relEntries = [];
                if (doc.hasOwnProperty('_entries')) {   // if document alreday contains entries
                    relEntries = doc._entries;
                } else {    // filter the given entries instead
                    relEntries = entries.filter( entry => entry.documentId === doc.uid );
                }
                doc.value = this.getEntrySum(relEntries);
                return doc;
            }
        )

        return documents;
    }

    // reduce duplicates by addition
    getUniqueEntries( entries: any[] ): any[] {

        // hash map entries
        let dict: Object = {};
        entries.forEach( 
            entry => {
                let _id = entry.name;
                if ( !dict.hasOwnProperty( _id ) ) {
                    dict[_id] = [];
                }
                dict[_id].push(entry);
            }
        );

        // merge hashed entries and return as a collection
        return Object.keys( dict ).map( 
            key => {

                let reduced: Object = {
                    name: key,
                    number: dict[key].length
                };

                // iterate grouped entries
                dict[key].forEach( 
                    (entry:Object) => {
                        let prices = entry['prices'];
                        if (!prices)
                            return;
                        
                        // iterate prices
                        Object.keys( prices ).forEach (
                            price => {
                                let val = Number(prices[price]);
                                if ( !isNaN(val) ) {  
                                    // merge prices
                                    reduced[price] = reduced.hasOwnProperty(price) ? reduced[price] + val : val;
                                }
                            }
                        ) // end forEach

                    }
                ) // end forEach

                return reduced;
            }
        );
    }

}