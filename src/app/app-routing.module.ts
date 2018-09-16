import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './page/about/about.component';
import { ContactComponent } from './page/contact/contact.component';
import { PrivacyComponent } from './page/privacy/privacy.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'turing', loadChildren: './turing/turing.module#TuringModule'},
  { path: 'stats', loadChildren: './dino-table/dino-table.module#DinoTableModule'},
  { path: 'sim', loadChildren: './dinosim/dinosim.module#DinosimModule' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

