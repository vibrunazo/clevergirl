import { Component, OnInit, Input } from '@angular/core';
import { Dino } from '../../dinosim/sim/sim.module';

@Component({
  selector: 'app-dinoname',
  templateUrl: './dinoname.component.html',
  styleUrls: ['./dinoname.component.scss']
})
export class DinonameComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

  getDisplayName(dino: string): string {
    const c = Dino.getColoredName(dino);
    return c;
  }

  getDinoRoute(dino: string): string {
    return `/stats/${dino}`;
  }

}
