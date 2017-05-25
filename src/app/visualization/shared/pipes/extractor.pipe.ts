import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'valueOfField' })
export class ExtractValueFieldPipe implements PipeTransform {
    transform(
        arr: any[] = [],
        field: string,
        defaultValue?: any // if value is not available
    ){

        if ( !arr || !field || field === '') {
            return arr;
        }

        let _arr =  arr.map(
            elem => ( elem.hasOwnProperty(field) ) ? elem[field] : defaultValue
        );

        // console.log('[extractor] return array: \n', _arr);

        return _arr;
    }
}