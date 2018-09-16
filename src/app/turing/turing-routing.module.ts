import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TuringComponent } from './turing.component';

const routes: Routes = [
  { path: '', component: TuringComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TuringRoutingModule { }
