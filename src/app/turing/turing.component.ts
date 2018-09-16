import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BOTS } from './botnames';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Ihastitle } from '../ihastitle';

@Component({
  selector: 'app-turing',
  templateUrl: './turing.component.html',
  styleUrls: ['./turing.component.css'],
  animations: [trigger('resultstate', [
    state('bot', style({
      backgroundColor: 'rgba(150, 250, 150, 1)'
    })),
    state('not', style({
      backgroundColor: 'rgba(250, 150, 150, 1)'
    })),
    state('hide', style({
      backgroundColor: 'rgba(250, 250, 150, 0)'
    })),
    transition('* => hide', animate('800ms ease-out')),
    transition('hide => *', animate('300ms ease-in')),
  ])]
})
export class TuringComponent implements OnInit, Ihastitle {

  result = 'Type the name of the player and search';
  namindex: number;
  adjindex: number;
  adjlist: string[];
  namlist: string[];
  anim = 'hide';
  options: string[] = BOTS.adj;
  allnames: string[];
  currentName: string;

  constructor() { }

  ngOnInit() {
    this.adjlist = BOTS.adj.map((value) => value.toLocaleLowerCase());
    this.namlist = BOTS.nam.map((value) => value.toLocaleLowerCase());
  }

  getAdjIndex(fullname: string) {
    const doesitstart = function(element) {
      return fullname.startsWith(element);
    };
    const i = this.adjlist.findIndex(doesitstart);

    return i;
  }

  onSearch(form: NgForm) {
    if (form.value.name === '') { return; }
    let input = form.value.name;
    input = input.toLowerCase();
    this.adjindex = this.getAdjIndex(input);
    if (this.adjindex >= 0) {
      let adj = BOTS.adj[this.adjindex];
      adj = adj.toLowerCase();
      const rest = input.replace(adj, '');
      this.namindex = this.namlist.indexOf(rest);
      if (this.namindex >= 0) {
        this.resultBot();
      } else {
        this.resultNot(form.value.name);
      }
    } else {
      this.resultNot(form.value.name);
    }
    this.gaSend(form.value.name);
  }

  gaSend(value: string) {
    // Send the event to the Google Analytics property
// with tracking ID GA_TRACKING_ID.
// (<any>window).gtag('config', 'UA-122077579-1', {'page_path': event.urlAfterRedirects});
(<any>window).gtag('event', 'search', {
  'send_to': 'UA-122077579-1',
  'event_category': 'Turing',
  'event_action': 'Search: ' + value,
  'event_value': value,
  'event_label': value,
});

  }

  resultBot() {
    const adj = BOTS.adj[this.adjindex];
    const nam = BOTS.nam[this.namindex];
    this.result = 'Yes, ' + adj + nam + ' is a bot.';
    this.anim = 'bot';
  }

  resultNot(input: string) {
    this.result = 'No, ' + input + ' is not a bot.';
    this.anim = 'not';
  }

  get rstatename() {
    return this.anim;
  }

  animationDone(event) {
    this.anim = 'hide';
  }

  filterNames(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      const i = this.getAdjIndex(filterValue);
      // console.log('adjindex: ' + i);
      let array = this.options.filter(option => option.toLowerCase().startsWith(filterValue));
      if (array.length === 1) {
        const adj = array[0];
        array = BOTS.nam.map(n => adj + n);
      } else if (array.length === 0 && i >= 0) {
        const adj = BOTS.adj[i];
        array = BOTS.nam.map(n => adj + n);
        array = array.filter(option => option.toLowerCase().startsWith(filterValue));
      }
      return array;
    }
    return [];
    // return this.options;
  }

  getTitle() {
    return 'Bot or Not';
  }
}
