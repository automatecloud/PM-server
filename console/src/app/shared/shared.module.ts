import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DataTableModule, DropdownModule, SharedModule as PrimeSharedModule, TreeTableModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/dragdrop';
import { AccordionModule as PMAccordionModule } from 'primeng/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TagInputModule } from 'ngx-chips';

import { FilterPipe } from './pipes/filter.pipe';
import { TruncatecharsPipe } from './truncatechars.pipe';
import { FeatureComponent } from './feature/feature.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { LinebreakPipe } from './pipes/linebreak.pipe';
import { InlineEditDirective } from './directives/inline-edit.directive';
import { InPipe } from '@shared/pipes/filterIn.pipe';
import { RawOutputComponent } from './raw-output/raw-output.component';
import { VaultSelectorComponent } from './components/vault-selector/vault-selector.component'
import {AutoCompleteModule} from 'primeng/primeng';

import { MapsCardsComponents } from './map-cards/map-cards.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TreeTableModule,
    PrimeSharedModule,
    DataTableModule,
    DragDropModule,
    PMAccordionModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    DropdownModule,
    NgxChartsModule,
    TagInputModule,
    AutoCompleteModule
  ],
  declarations: [
    FilterPipe,
    TruncatecharsPipe,
    FeatureComponent,
    ConfirmComponent,
    InlineEditDirective,
    LinebreakPipe,
    InPipe,
    RawOutputComponent,
    VaultSelectorComponent,
    MapsCardsComponents
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    TagInputModule,
    FilterPipe,
    TruncatecharsPipe,
    FeatureComponent,
    TreeTableModule,
    PMAccordionModule,
    DragDropModule,
    PrimeSharedModule,
    DataTableModule,
    NgxChartsModule,
    DropdownModule,
    InlineEditDirective,
    ConfirmComponent,
    LinebreakPipe,
    InPipe,
    VaultSelectorComponent,
    MapsCardsComponents
  ],
  entryComponents: [ConfirmComponent, RawOutputComponent]
})
export class SharedModule {
}
