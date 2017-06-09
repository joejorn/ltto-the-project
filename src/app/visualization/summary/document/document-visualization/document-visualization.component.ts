import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VisualizationFnService } from '../../../shared/services/visualization-fn.service';
import { IDetailedDocument } from '../../../shared/interfaces/detail-document.interface';

@Component({
  moduleId: module.id,
  selector: 'ltto-document-visualization',
  templateUrl: 'document-visualization.component.html',
  styleUrls: ['document-visualization.component.css']
})

export class DocumentVisualizationComponent implements OnInit, OnChanges {

	private loading: boolean;

    @Input() public document: IDetailedDocument;
    @Input() public priceList: any[];   // @TODO: remove this
    @Input() public priceCategories: any[];

    private sumCategories: any[];

	constructor(private fnService: VisualizationFnService) {
        this.priceList = [];
        this.priceCategories = [];
	}

    /*private getCategoriesDetail( entries: any[] = [] ) {
        return this.fnService.getSumByCategory( this.priceList, entries );
    }*/

    ngOnInit() {
        // this.initDocument();
    }

    ngOnChanges( changes: SimpleChanges ) {
        if (changes['document']) {
            let doc = changes['document'].currentValue;
            this.initDocument();
        }
    }

    private initDocument() {

        if (!this.document) {
            return;
        }

        this.computeDocumentSum();
        this.computeSheetSum();
        this.computeSheetGroupSum();
    }

    private computeDocumentSum() {
        let entries = [];
        if ( this.document._entries ) {
            entries = this.document._entries;
        }

        // include the multiplied prices
        let includeNetFunc = (acc: any[], b: any) => {
                                let arr = [ { name: b.name, value: b.value } ];
                                if (b.value !== 0 && b.multiplier && b.multiplier.factor !== 0) {
                                    let _str = `(${b.multiplier.factor * 100} %)`;
                                    arr.push({name: _str, value: b.multiplier.value});
                                }

                                return acc.concat(arr);
                            }

        this.document._sum = this.getSum( entries ).reduce( includeNetFunc, [] );
        
    }

    private computeSheetSum() {
        let arr = (this.document._sheets) ? this.document._sheets : [];
        if (arr) {
            arr.forEach(
                sheet => {      // for each SHEET
                    let entries = this.document._entries.filter(
                        entry => entry.sheetId === sheet.uid
                    )
                    sheet._sum = this.getSum( entries, true );
                }
            )
        }
    }

    private computeSheetGroupSum() {
        let groups = this.document._sheetGroups ? ​this.document._sheetGroups : [];
        let sheets = this.document._sheets ? this.document._sheets : [];
        if (groups) {
            groups.forEach(
                group => {      // for each SHEET-GROUP
                    let sheetIds = group.members ? Object.keys(group.members) : [];

                    if (sheetIds.length > 0 && sheets) {
                        group._items = sheets.filter( sheet => sheetIds.indexOf(sheet.uid) > -1 )
                                            .map( 
                                                sheet => {
                                                    return { name: sheet.name, values: sheet._sum }
                                                }
                                            );
                    }
                }
            )
        }
    }

    // grouped by price category
    private getSum( entries: any[], grossPriceOnly: boolean = false ) {
        return this.fnService.getSumByPriceCategory(this.priceCategories, entries, grossPriceOnly);
    }
    
}