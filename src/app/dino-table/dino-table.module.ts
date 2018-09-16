import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DinoTableRoutingModule } from "./dino-table-routing.module";
import { DinoTableComponent } from "./dino-table.component";
import {
  MatCardModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatListModule,
  MatProgressBarModule,
  MatDividerModule,
  MatSliderModule
} from "@angular/material";
import { ProfileComponent } from "./profile/profile.component";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    DinoTableRoutingModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatProgressBarModule,
    MatDividerModule,
    SharedModule,
    MatSliderModule,
    FormsModule
  ],
  declarations: [DinoTableComponent, ProfileComponent]
})
export class DinoTableModule {}
