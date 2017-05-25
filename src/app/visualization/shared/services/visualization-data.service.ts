import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentDataService }  from '../../../service-module/database/data/document/document.service';
import { SheetDataService }  from '../../../service-module/database/data/sheet/sheet.service';
import { SheetGroupDataService }  from '../../../service-module/database/data/sheet-group/sheet-group.service';
import { EntryDataService }  from '../../../service-module/database/data/entry/entry.service'

/*
Service provide APIs required for management of "sheets" and "sheet groups"
*/

@Injectable()
export class VisualizationDataService {

    constructor(
        private docService: DocumentDataService,
        private sheetService: SheetDataService,
        private sheetGroupService: SheetGroupDataService,
        private entryService: EntryDataService
    ){}

    getDocuments(): Observable<any[]> {
        return this.docService.getObjectList();
    }

    getDetailDocument(documentId): Observable<any> {
        return this.docService.getExtendedObject(documentId);
    }

    getDetailDocuments(): Observable<any[]> {
        return Observable.forkJoin(

                    this.docService.getObjectList().first(),
                    this.sheetGroupService.getObjectList().first(),
                    this.sheetService.getObjectList().first(),
                    this.entryService.getObjectListByProperty('', null).first()
                    
                ).switchMap(
                    values => {
                        this.buildDetailDocuments(values[0], values[1], values[2], values[3])
                        return values;
                    }
                )
    }


    // nesting function
    private buildDetailDocuments( documents: any[], sheetGroups: any[], sheets: any[], entries: any[] ): void {
        let filterFn = (docId:string, item:any) => { return item.documentId === docId };

        let arrs = [sheetGroups, sheets, entries];
        let arrKeys = ['sheetGroups', 'sheets', 'entries'];

        documents.forEach(
            doc => {
                // properties
                arrs.forEach( 
                    (arr:any[], arrIndex: number) => {
                        if (arr) {
                            let arrKey =  arrKeys[arrIndex];
                            doc['_' + arrKey] = arr.filter( 
                                                (item:any)  => {
                                                    return item.documentId === doc.uid; 
                                                } 
                                            );
                        } // end if
                    }
                );  // end arrs-forEach
            }
        ); // end documents-forEach
    }

}