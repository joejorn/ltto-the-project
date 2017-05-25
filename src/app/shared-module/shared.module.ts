import { NgModule, ModuleWithProviders } from '@angular/core';

// Pipes
import { FilterByFieldValuePipe } from './pipes/filter.pipe';
import { SortByFieldPipe } from './pipes/sort.pipe';

@NgModule({
    declarations: [
        FilterByFieldValuePipe,
        SortByFieldPipe,
    ],
    exports: [
        FilterByFieldValuePipe,
        SortByFieldPipe,
    ]
})

export class SharedModule {}