import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import { NgForm } from "@angular/forms";
import { Ihastitle } from "../ihastitle";
import { SimModule, Battle, CurStats, BaseStats, Dino } from "./sim/sim.module";
import { DINOS } from "../dino-table/dinostats";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { Location } from "@angular/common";

@Component({
  selector: "app-dinosim",
  templateUrl: "./dinosim.component.html",
  styleUrls: ["./dinosim.component.scss"]
})
export class DinoSimComponent implements OnInit, Ihastitle {
  simulator: SimModule = new SimModule();
  dinos: string[] = [];
  result: string;
  dino1name = "Velociraptor";
  dino2name = "Allosaurus";
  displayname = {
    1: "Velociraptor",
    2: "Allosaurus"
  };
  d1state: CurStats;
  d2state: CurStats;
  d1stats: BaseStats;
  d2stats: BaseStats;
  color = "primary";
  level = {
    1: 26,
    2: 26
  };
  wins = {
    1: 0,
    2: 0
  };
  control = {
    1: "player",
    2: "bot-strong"
  };
  fate = {
    1: "random",
    2: "random"
  };
  battle: Battle;
  curskill = {
    1: 0,
    2: 0
  };
  crit = {
    1: false,
    2: false
  };
  stun = {
    1: false,
    2: false
  };
  dodge = {
    1: false,
    2: false
  };
  // location: Location;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // filter to show only those that are implemented
    // the implemented ones have moves
    // needs to check for moves in 2 different ways because the battle sim edits the moves
    const dinos = DINOS.filter(dino => dino.move1 || dino.moves);

    this.dinos = dinos.map(dino => dino.name);

    this.route.params.subscribe(params => {
      // console.log(params);
      if (params.d1) {
        this.dino1name = params.d1;
        this.displayname[1] = this.getDisplayName(1);
      }
      if (params.d2) {
        this.dino2name = params.d2;
        this.displayname[2] = this.getDisplayName(2);
      }
      if (!params.d1 || !params.d2) {
        this.updateRoute();
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params.c1) { this.control[1] = params.c1; }
      if (params.c2) { this.control[2] = params.c2; }
      if (params.f1) { this.fate[1] = params.f1; }
      if (params.f2) { this.fate[2] = params.f2; }
      if (params.l1) { this.level[1] = params.l1; }
      if (params.l2) { this.level[2] = params.l2; }
    });
  }

  startSim(dino1: string, dino2: string) {
    this.battle = new Battle(dino1, dino2);
    this.battle.setupPlayers(this.control[1], this.control[2]);
    this.battle.getDino(1).setLevel(this.level[1]);
    this.battle.getDino(2).setLevel(this.level[2]);
    this.updateStats();
    this.d1stats = this.battle.getDinoStats(1);
    this.d2stats = this.battle.getDinoStats(2);
    this.battle.getDino(1).setFate(this.fate[1]);
    this.battle.getDino(2).setFate(this.fate[2]);
    if (this.control[1] != "player" && this.control[2] != "player") {
      this.battle.nextTurn(1, 1);
    }

    this.updateStats();
    // const ov = of(this.battle).subscribe(console.log);

    this.result = this.battle.printCombatlog();
  }

  updateRoute() {
    // this.router.navigateByUrl(`sim/${this.dino1name}/${this.dino2name}`,
    //  params.c1 != "player"
    const qparams: any = {};
    if (this.control[1] != "player") { qparams.c1 = this.control[1]; }
    if (this.control[2] != "bot-strong") { qparams.c2 = this.control[2]; }
    if (this.fate[1] != "random") { qparams.f1 = this.fate[1]; }
    if (this.fate[2] != "random") { qparams.f2 = this.fate[2]; }
    if (this.level[1] != 26) { qparams.l1 = this.level[1]; }
    if (this.level[2] != 26) { qparams.l2 = this.level[2]; }
    this.router.navigate([`sim/${this.dino1name}/${this.dino2name}`], {
      queryParams: qparams
    });
  }

  onSimButton(form: NgForm) {
    if (form.value.name === "") {
      return;
    }
    // this.select1.writeValue('Velociraptor');
    const dino1 = form.value.dino1;
    const dino2 = form.value.dino2;
    this.gaSend("Fight");
    this.updateRoute();
    this.startSim(dino1, dino2);
  }

  updateStats() {
    const d1state: CurStats = this.battle.getCurDinoState(1);
    const d2state: CurStats = this.battle.getCurDinoState(2);
    this.d1state = d1state;
    this.d2state = d2state;
    this.checkWinner();
  }

  checkWinner() {
    if (this.battle.getDino(1).isAlive() && !this.battle.getDino(2).isAlive()) {
      this.setWinner(1);
      return;
    }
    if (this.battle.getDino(2).isAlive() && !this.battle.getDino(1).isAlive()) {
      this.setWinner(2);
      return;
    }
    if (
      !this.battle.getDino(2).isAlive() &&
      !this.battle.getDino(1).isAlive()
    ) {
      this.gaSend("draw");
      return;
    }
  }

  setWinner(player: number) {
    this.wins[player]++;
    this.gaSend("Win: " + player);
  }

  getTitle(): string {
    return "Battle Simulator";
  }

  onSkillClick(player: number, skill: number) {
    this.curskill[player] = skill;
    if (!this.battle) {
      return;
    }
    if (
      !this.battle.getDino(1).isAlive() ||
      !this.battle.getDino(2).isAlive()
    ) {
      return;
    }
    if (
      (this.curskill[1] !== 0 || this.control[1].includes("bot")) &&
      (this.curskill[2] !== 0 || this.control[2].includes("bot"))
    ) {
      this.runNextTurn();
    }
  }

  runNextTurn() {
    this.battle.getDino(1).setLuck("crit", this.crit[1]);
    this.battle.getDino(1).setLuck("stun", this.stun[1]);
    this.battle.getDino(1).setLuck("dodge", this.dodge[1]);
    this.battle.getDino(2).setLuck("crit", this.crit[2]);
    this.battle.getDino(2).setLuck("stun", this.stun[2]);
    this.battle.getDino(2).setLuck("dodge", this.dodge[2]);
    this.battle.nextTurn(this.curskill[1], this.curskill[2]);

    this.curskill[1] = 0;
    this.curskill[2] = 0;
    this.result = this.battle.printCombatlog();
    this.updateStats();
  }

  // returns the cooldown of the move
  getCd(dino: number, move: number): number {
    return dino === 1
      ? this.d1state.cooldowns[move]
      : this.d2state.cooldowns[move];
  }

  isDis(dino: number, move: number): boolean {
    return this.getCd(dino, move) > 0 || this.control[dino] !== "player";
  }

  // returns if this move is the Current move selected for this dino
  isCur(dino: number, move: number): string {
    return this.curskill[dino] === move + 1 || this.curskill[dino] === 0
      ? "accent"
      : "primary";
  }

  showBox(player: number, box: string): boolean {
    if (this.fate[player] === "manual") {
      return true;
    }
    return false;
  }

  bufflist(dino: number): string {
    const d: CurStats = this.getState(dino);
    let s = "";
    if (this.getStats(dino).passive) {
      s += this.getStats(dino).passive + " ";
    }

    if (!d || d.buffs.length === 0) {
      return s;
    }

    s += d.buffs.map(b => b.type).toString();
    return s;
  }

  debufflist(dino: number): string {
    const d: CurStats = this.getState(dino);
    if (!d || d.debuffs.length === 0) {
      return " ";
    }
    let s: string;

    s = d.debuffs.map(b => b.type).toString();
    return s;
  }

  hpcolor(dino: number): string {
    const state: CurStats = this.getState(dino);
    const stats: BaseStats = this.getStats(dino);
    if (!state) {
      return " ";
    }

    if (state.hp <= stats.hp * 0.25) {
      return "red";
    }
    if (state.hp <= stats.hp * 0.5) {
      return "yellow";
    }
    return "green";
  }

  getState(dino: number): CurStats {
    let d: CurStats;
    if (dino === 1) {
      d = this.d1state;
    }
    if (dino === 2) {
      d = this.d2state;
    }
    return d;
  }

  getStats(dino: number): BaseStats {
    let d: BaseStats;
    if (dino === 1) {
      d = this.d1stats;
    }
    if (dino === 2) {
      d = this.d2stats;
    }
    return d;
  }

  get(stat: string, dino: number): number {
    const state = this.getState(dino);
    const stats = this.getStats(dino);
    if (!stats || !state) {
      return 0;
    }
    if (stat == "hp%") {
      return Math.ceil((100 * state["hp"]) / stats["hp"]);
    }
    return Math.ceil(state[stat]);
  }

  getDinoRoute(dino: string): string {
    return `/stats/${dino}`;
  }

  getDisplayName(dino: number): string {
    if (!this.battle) {
      return "";
    }
    const d = this.battle.getDino(dino);
    return d.getColoredName();
  }

  gaSend(value: string) {
    // Send the event to the Google Analytics property
    // with tracking ID GA_TRACKING_ID.
    // (<any>window).gtag('config', 'UA-122077579-1', {'page_path': event.urlAfterRedirects});

    const d1 = this.dino1name;
    const d2 = this.dino2name;
    const c1 = this.control[1];
    const c2 = this.control[2];
    const f1 = this.fate[1];
    const f2 = this.fate[2];
    const l1 = this.level[1];
    const l2 = this.level[2];
    (<any>window).gtag("event", "sim", {
      send_to: "UA-122077579-1",
      event_category: "Sim",
      event_action: `d1=${d1}, d2=${d2}, c1=${c1}, c2=${c2}, f1=${f1}, f2=${f2}, l1=${l1}, l2=${l2}`,
      event_value: value,
      event_label: value
    });
  }

  getRarity(dino: string): string {
    return Dino.findRarityName(dino);
  }
}
