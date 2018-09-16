import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinoSimComponent } from './dinosim.component';

const routes: Routes = [
  {path: '', component: DinoSimComponent},
  {path: ':d1/:d2', component: DinoSimComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DinosimRoutingModule { }
