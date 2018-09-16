import { Component, OnInit } from '@angular/core';
import { Ihastitle } from '../../ihastitle';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit, Ihastitle {

  constructor() { }

  ngOnInit() {
  }

  getTitle() {
    return 'Privacy Policy';
  }

}
