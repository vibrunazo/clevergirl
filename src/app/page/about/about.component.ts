import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Ihastitle } from '../../ihastitle';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-about',
  // templateUrl: '../page.component.html',
  templateUrl: './about.component.html',
  // styleUrls: ['../page.component.scss'],
  // encapsulation: ViewEncapsulation.None
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends PageComponent implements OnInit, Ihastitle {

  ngOnInit() {
  }

  getTitle(): string {
    return "About Clever Girl";
  }

}
