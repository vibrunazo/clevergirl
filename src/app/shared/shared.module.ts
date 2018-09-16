import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PortraitComponent } from "./portrait/portrait.component";
import { RouterModule } from "@angular/router";
import { DinonameComponent } from "./dinoname/dinoname.component";
import { DinolevelComponent } from "./dinolevel/dinolevel.component";
import { MatSliderModule } from "@angular/material";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, RouterModule, MatSliderModule, FormsModule],
  declarations: [PortraitComponent, DinonameComponent, DinolevelComponent],
  exports: [PortraitComponent, DinonameComponent, DinolevelComponent]
})
export class SharedModule {}
