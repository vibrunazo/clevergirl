import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DinosimRoutingModule } from "./dinosim-routing.module";
import {
  MatCardModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatDividerModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatSliderModule,
} from "@angular/material";
import { DinoSimComponent } from "./dinosim.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    DinosimRoutingModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    SharedModule,
    MatSliderModule
  ],
  declarations: [DinoSimComponent]
})
export class DinosimModule {}
