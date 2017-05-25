import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterByFieldValue' })
export class FilterByFieldValuePipe implements PipeTransform {
    transform(
        arr: any[] = [],
        field: string,
        fieldValue: any,
        filterMode: string = 'include' // 'exclude' vs 'include' 
    ){
        if ( !arr || !field || field === '') {
            return arr;
        }

		// console.log('initial array: \n', arr);

        let _arr =  arr.filter( elem => {
                    let bool: boolean = false;
                    if (fieldValue!=='$any' && fieldValue!=='*') { // specific value given
                        bool = elem[field] === fieldValue;
                    } else {
                        bool = elem.hasOwnProperty(field) && 
                                (typeof elem[field] === 'string' && elem[field] !== '') || 
                                (typeof elem[field] === 'number' ) ||
                                (typeof elem[field] === 'boolean' && elem[field] ) ||
                                (typeof elem[field] === 'object' && elem[field] !== undefined && elem[field] !== null );
                    }
                    return filterMode==='include' ? bool : !bool;
                });

		// console.log('filtered array: \n', _arr);
        return _arr;
    }
}