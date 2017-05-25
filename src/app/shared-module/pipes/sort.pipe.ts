import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByField' })
export class SortByFieldPipe implements PipeTransform {
    transform(
        arr: any[] = [],
        field: string,
        sortMode: string = 'ascending' // 'ascending' vs 'descending' 
    ){

        // console.log('sort pipe: ', arr);

        if ( !arr || !field || field === '') {
            return arr;
        }

        let ascending = (sortMode === 'descending') ? false: true;
        arr.sort( (a,b) => {
                let valA = a[field];
                if (typeof valA == 'string')
                    valA = valA.toUpperCase();  // ignore lower/upper case

                let valB = b[field]; 
                if (typeof valB == 'string')
                    valB = valB.toUpperCase();  // ignore lower/upper case

                let newPos = 0; // default: no position change
                if (valA < valB) {
                    newPos = ascending ? -1 : 1;
                } else if (valA > valB) {
                    newPos = ascending ? 1 : -1;
                }
                // console.log(`compare value: "${valA}" <=> "${valB}": ${newPos}`);
                return newPos;
            })

        // console.log('sorted: ', arr);

        return arr;
    }
}