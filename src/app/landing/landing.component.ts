import { Component, OnInit } from '@angular/core';
import { Ihastitle } from '../ihastitle';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, Ihastitle {

  constructor() { }

  ngOnInit() {
  }

  getTitle() {
    return 'Welcome to Clever Girl app';
  }

}
