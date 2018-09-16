import { Component, ViewChild } from "@angular/core";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";
  @ViewChild(MainNavComponent) navcomponent: MainNavComponent;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // (<any>window).ga("set", "page", event.urlAfterRedirects);
        // (<any>window).ga("send", "pageview");
        (<any>window).gtag('config', 'UA-122077579-1', {'page_path': event.urlAfterRedirects});
      }
    });
  }

  public onRouterOutletActivate(event: any) {
    this.navcomponent.setContent(event);
  }
}
