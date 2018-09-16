import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DinoTableComponent } from './dino-table.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', component: DinoTableComponent},
  {path: ':dino', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DinoTableRoutingModule { }
