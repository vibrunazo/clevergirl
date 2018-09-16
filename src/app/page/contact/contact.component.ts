import { Component, OnInit } from '@angular/core';
import { Ihastitle } from '../../ihastitle';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, Ihastitle {

  constructor() { }

  ngOnInit() {
  }

  getTitle(): string {
    return 'Contact';
  }
}
