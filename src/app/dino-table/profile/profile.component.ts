import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DINOS } from "../dinostats";
import { Dino, Move } from "../../dinosim/sim/sim.module";
import { Ihastitle } from "../../ihastitle";
import { MainNavComponent } from "../../main-nav/main-nav.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, Ihastitle {
  name: string;
  dino: Dino;
  navref: MainNavComponent;

  level = 26;
  fromlevel = 20
  tolevel = 22
  inglevel = [15, 20];

  showBar = {
    hp: 0,
    armor: 0,
    damage: 0,
    crit: 0,
    speed: 0
  };
  high = {
    hp: 0,
    armor: 0,
    damage: 0,
    crit: 0,
    speed: 0
  };
  low = {
    hp: 2000,
    armor: 0,
    damage: 1000,
    crit: 5,
    speed: 110
  };
  stats = ["hp", "armor", "damage", "crit", "speed"];
  adj = {
    hp: "bulky",
    armor: "armored",
    damage: "strong",
    crit: "dangerous",
    speed: "fast",
    none: "cool"
  };
  intensity = ["", "really", "very", "extremelly"];
  ingredients: string[];
  hybrids: string[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.dino) {
        this.setDino(params.dino);
      }
    });
  }

  iniStats() {
    if (this.high["hp"] == 0) {
      DINOS.forEach(d => {
        this.stats.forEach(stat => {
          this.high[stat] = Math.max(this.high[stat], d[stat]);
          this.low[stat] = Math.min(this.low[stat], d[stat]);
        });
      });
    }
  }

  setDino(name: string) {
    this.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    let dino: Dino;
    try {
      dino = new Dino(name);

      this.iniStats();
    } catch (error) {
      console.error("Could not find dino named " + name);
    }
    this.dino = dino;
    this.updateTitle();
    this.startBarAnim();
    this.setHybrids();
  }

  setHybrids() {
    const name = this.dino.getName();
    const dino = DINOS.find(d => d.name == name);
    // console.log('dname: ' + this.dino.getName());

    if (dino.ing1 && dino.ing2) {
      this.ingredients = [];
      this.ingredients.push(dino.ing1);
      this.ingredients.push(dino.ing2);
    } else {
      this.ingredients = undefined;
    }

    this.hybrids = Dino.getHybrids(name);
  }

  startBarAnim() {
    const base = 1200;
    const inc = 150;
    setTimeout(() => (this.showBar["hp"] = 1), base + inc * 0);
    setTimeout(() => (this.showBar["armor"] = 1), base + inc * 1);
    setTimeout(() => (this.showBar["damage"] = 1), base + inc * 2);
    setTimeout(() => (this.showBar["crit"] = 1), base + inc * 3);
    setTimeout(() => (this.showBar["speed"] = 1), base + inc * 4);
  }

  getBar(stat: string): number {
    return this.getStatPct(stat) * this.showBar[stat];
  }

  updateTitle() {
    this.navref.updateTitle(this.name + "'s Profile");
  }

  getTitle(ref) {
    this.navref = ref;
    return "Stats";
  }

  get(stat: string): number {
    // console.log('updatni');
    this.dino.setLevel(this.level);
    return this.dino.basestats[stat];
  }

  getBaseStat(stat: string): number {
    return this.dino.getStatAt26(stat);
  }

  getDisplayName(): string {
    return this.dino.getColoredName();
  }

  getRarityName(): string {
    return this.dino.getColorClass();
  }

  getStatPct(stat: string): number {
    const me = +this.getBaseStat(stat);
    const high = this.high[stat];
    const low = this.low[stat];
    const r = (100 * (me - low)) / (high - low);
    // console.log(`me = ${me} high = ${high} low = ${low} r = ${r} `);

    return Math.floor(r);
  }

  getHighestStat(): string {
    let high = 0;
    let beststat = "none";
    this.stats.forEach(s => {
      if (+this.getStatPct(s) > high) {
        high = +this.getStatPct(s);
        beststat = s;
      }
    });
    // console.log('best stat is ' + beststat + " with " + high);

    return beststat;
  }

  getAdj(): string {
    return this.adj[this.getHighestStat()];
  }

  getIntensity(): string {
    const i = this.getStatPct(this.getHighestStat());
    if (i > 80) {
      return "an " + this.intensity[3];
    }
    if (i > 70) {
      return "a " + this.intensity[2];
    }
    if (i > 50) {
      return "a " + this.intensity[1];
    }
    return "a " + this.intensity[0];
  }

  getMoveName(move: number): string {
    try {
      const name = this.dino.basestats.moves[move].name;
      return name;
    } catch (error) {
      return undefined;
    }
  }

  getMoveNames(): string[] {
    const r = [];
    this.dino.basestats.moves.forEach(m => {
      if (m && m.name.length > 0) {
        r.push(m.name);
      }
    });
    return r;
  }

  getMoveStats(name: string, stat: string): string {
    const movenames = this.getMoveNames();
    const i = movenames.indexOf(name);
    const move: Move = this.dino.basestats.moves[i];
    return move[stat];
  }

  getPassive(): string {
    return this.dino.basestats.passive;
  }

  hasPassive(): boolean {
    return this.dino.basestats.passive ? true : false;
  }

  getImageUrl(dino: string): string {
    let str = '';
    // str = `https://res.cloudinary.com/vibrunazo/image/upload/c_scale,f_auto,q_auto,w_50,f_jpg/profiles/${this.getImageName(dino)}`;
    str = `https://res.cloudinary.com/vibrunazo/image/upload/c_scale,f_auto,q_auto:best,w_200/profile/${this.getImageName(dino)}`;
    return str;
  }

  getImageName(dino: string): string {
    dino = dino.replace("Gen ", "GEN");
    // dino = dino.replace(" ", "_");
    dino = dino.split(" ").join("_");
    return `JWA_Profile_${dino}`;
  }

  isHybrid(): boolean {
    if (this.ingredients) { return true; }
    return false;
  }

  getIngredients(): string[] {
    // let name1 = this.ingredients[0];
    // name1 = Dino.getColoredName(name1, true);
    // let name2 = this.ingredients[1];
    // name2 = Dino.getColoredName(name2, true);
    // return name1 + ' and ' + name2;
    return this.ingredients;
  }

  isParent(): boolean {
    if (this.hybrids) { return true; }
    return false;
  }

  getHybrids(): string[] {
    // let str = '';
    // this.hybrids.forEach(h => str += Dino.getColoredName(h, true) + ", ");
    // str = str.slice(0, -2);
    // return str;

    // const names: string[] = [];
    // this.hybrids.forEach(h => names.push(h));
    // return names;

    return this.hybrids;
  }

  // "hybrid" or "hybrids" depending on the number of hybrids
  getHybridNoun(): string {
    return this.numHybrids() == 1 ? "hybrid" : "hybrids";
  }

  // how many hybrids do I have
  numHybrids(): number {
    return this.hybrids.length;
  }

  // returns how much DNA of dino this dino needs to level up to this level
  getDNAcost(dino: string): number {
    const cost = Dino.getDNAFromToName(dino, this.fromlevel, this.tolevel);
    return cost;
  }

  // returns how much DNA of dino, the hybrid dinosaur in the profile would need to get to this level
  getIngcost(dino: string, level: number): number {
    const cost = Dino.getIngcost(dino, level, this.name, this.fromlevel, this.tolevel);
    return cost;
  }

}
