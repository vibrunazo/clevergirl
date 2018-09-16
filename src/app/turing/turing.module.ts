import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TuringRoutingModule } from './turing-routing.module';
import { TuringComponent } from './turing.component';
import { MatCardModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TuringRoutingModule,
    MatCardModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [TuringComponent]
})
export class TuringModule { }
