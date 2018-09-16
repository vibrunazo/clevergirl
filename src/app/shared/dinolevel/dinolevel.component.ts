import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dinolevel',
  templateUrl: './dinolevel.component.html',
  styleUrls: ['./dinolevel.component.scss']
})
export class DinolevelComponent implements OnInit {
  @Input() value = 26;

  constructor() { }

  ngOnInit() {
  }

}
