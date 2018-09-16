import { Component, ViewChild } from "@angular/core";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Ihastitle } from "../ihastitle";
import { MatSidenav, MatButton } from "@angular/material";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild("handsetmenu") handsetmenu: MatButton;
  heading;
  contentComponent: Ihastitle;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private titleService: Title) {}

  setContent(component: Ihastitle) {
    this.contentComponent = component;
    this.updateTitle(component.getTitle(this));
  }

  closeSidenav() {
    // only closes sidenav if in handset mode
    // we're sure we're in handset mode if the handset menu button was found
    if (this.handsetmenu) {
      this.sidenav.close();
    }
  }

  updateTitle(title: string) {
    this.heading = title;
    this.titleService.setTitle("Clever Girl " + title);
  }
}
