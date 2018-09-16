import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatAutocompleteModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
} from "@angular/material";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { FormsModule } from "@angular/forms";
import { LandingComponent } from "./landing/landing.component";
import { AppRoutingModule } from ".//app-routing.module";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { PageComponent } from "./page/page.component";
import { AboutComponent } from "./page/about/about.component";
import { ContactComponent } from "./page/contact/contact.component";
import { PrivacyComponent } from "./page/privacy/privacy.component";
import { SharedModule } from "./shared/shared.module";
import { Post01Component } from './page/posts/post01/post01.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LandingComponent,
    FooterComponent,
    PageComponent,
    AboutComponent,
    ContactComponent,
    PrivacyComponent,
    Post01Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
