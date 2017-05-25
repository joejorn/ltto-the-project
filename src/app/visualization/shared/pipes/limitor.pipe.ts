import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'limitSize' })
export class LimitSizePipe implements PipeTransform {
    transform( arr: any[] = [], maxSize: number = 0 ){
        if ( !arr || maxSize < 1 || arr.length < maxSize ) {
            return arr;
        }
		
		return arr.slice(0, maxSize);
    }
}