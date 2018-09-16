import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { Ihastitle } from '../ihastitle';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, Ihastitle {

  // @ContentChild(TemplateRef) templateRef;
  @Input() title: string;
  @Input() date: string; // just the output of: new Date()

  constructor() { }

  ngOnInit() {
  }

  getTitle(): string {
    return 'Clever Girl';
  }

}
