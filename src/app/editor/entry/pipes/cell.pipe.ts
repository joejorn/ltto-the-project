import { Pipe, PipeTransform } from '@angular/core';

// Count-Pipe supporting dynamic category

@Pipe({ name: 'countVisibleCell' })
export class CountVisibleCellPipe implements PipeTransform {

	transform(
            arr: Array<any>=[], 
            // attr: string="_category",
            attr: string="_categoryId",
            category:string="$all"  // default category
        ) 
	{
        let _no = 0;

        if (arr) 
            _no = arr.filter( elem => elem[attr] && elem[attr]===category ).length;
        
        return _no;
            
    }
}

@Pipe({ name: 'setVisibleCell' })
export class SetVisibleCellPipe implements PipeTransform {

    private DEFAULT_CATEGORY: string = '$all';
	// private defaultCategory: string = EntryListComponent.DEFAULT_CATEGORY; // '$all'

	transform(
		arr: Array<any>=[], 
		cellDirection: string = 'vertical', 
		category:string, 
		columnList: any[] 
    ) 
	{
		if (!arr) {
			return [];
		}

		if (category === this.DEFAULT_CATEGORY) {

			arr.forEach( elem => {
				elem._hidden = false;
				elem._categoryId = this.DEFAULT_CATEGORY;
			});

		} else if (cellDirection === 'vertical') {	// column
			
			arr.forEach(

				elem => {
					elem._hidden = 	!(category === this.DEFAULT_CATEGORY || 
									elem.categoryId === category || 
									elem.categoryId === this.DEFAULT_CATEGORY);
					elem._category = elem._hidden ? this.DEFAULT_CATEGORY : category;
				}
					
			);

		} else if (cellDirection === 'horizontal') {	// row

			arr.forEach(
				elem => {

					let filteredProp = columnList.filter( col => col.categoryId === category)
											.map( col => col.property);


					// check if one of related properties has a value
					let bools = filteredProp.map( prop => {
									let num = Number(elem.prices[prop]);
									return num !== NaN && num > 0;
								});
					
					elem._hidden = bools.indexOf( true ) < 0;   // no column that fit the condition
					elem._categoryId = elem._hidden ? this.DEFAULT_CATEGORY : category;
				}
			);
		}

		// console.log('visibility array: ', arr);
		
		return arr;
	}

}