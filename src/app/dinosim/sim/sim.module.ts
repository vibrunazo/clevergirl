import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Bot } from "./bots/bot";
import { DINOS } from "../../dino-table/dinostats";
import { MOVES } from "../../dino-table/moves";
import { PARENTS } from "../../dino-table/parents";
import { LEVELUP } from "../../shared/data/levelup";
import { BotFactory } from "./bots/factory";


@NgModule({
  imports: [CommonModule],
  declarations: []
})
export class SimModule {
  startSim() {
    return "finished sim";
  }
}

export class Battle {
  dino1: Dino;
  dino2: Dino;
  control = {
    1: "bot",
    2: "bot"
  };
  turns: Turn[] = [];
  combatlog: string[] = [];

  constructor(dino1name: string, dino2name: string) {
    this.dino1 = new Dino(dino1name, this);
    this.dino2 = new Dino(dino2name, this);

    this.turnZero();
    // this.allTurns();
  }

  setupPlayers(p1: string, p2: string) {
    this.control[1] = p1;
    this.control[2] = p2;
  }

  getDino(index: number): Dino {
    return index === 1 ? this.dino1 : this.dino2;
  }

  startSim() {
    this.allTurns();
  }

  log(message: string) {
    this.combatlog.push(message);
  }

  getCurStepState(): Step {
    return this.turns[this.turns.length - 1].step2;
  }

  getCurDinoState(dino: number): CurStats {
    const step: Step = this.getCurStepState();
    const stat: CurStats = step["d" + dino + "stats"];
    return stat;
  }

  getStep1State(dino: number): CurStats {
    const step: Step = this.getCurTurn().step1;
    const stat: CurStats = step["d" + dino + "stats"];

    return stat;
  }

  getDamageTakenCurTurn(dino: number): number {
    if (this.turns.length < 1) {
      return 0;
    }
    const cur = this.getCurTurn();
    const last = this.turns[this.turns.length - 2];
    const curhp = cur.step2["d" + dino + "stats"].hp;
    const lasthp = last.step2["d" + dino + "stats"].hp;
    return lasthp - curhp;
  }

  getCurTurn(): Turn {
    return this.turns[this.turns.length - 1];
  }

  getDinoStats(dino: number): BaseStats {
    const stats: BaseStats =
      dino === 1 ? this.dino1.basestats : this.dino2.basestats;
    return stats;
  }

  allTurns() {
    this.calcTurn(1, 2, 2);
    this.calcTurn(2, 1, 1);
    this.calcTurn(3, 2, 1);
  }

  nextTurn(p1move: number, p2move: number) {
    if (!this.dino1.isAlive() || !this.dino2.isAlive()) {
      return;
    }

    const curturn = this.turns.length;
    if (this.control[1].includes("bot")) {
      p1move = this.calcBotMove(1);
    }
    if (this.control[2].includes("bot")) {
      p2move = this.calcBotMove(2);
    }
    this.calcTurn(curturn, p1move, p2move);

    if (
      this.control[1].includes("bot") &&
      this.control[2].includes("bot") &&
      curturn < 10
    ) {
      this.nextTurn(1, 1);
    }
  }

  private calcBotMove(player: number): number {
    const bot: Bot = BotFactory.getBotFromName(this.control[player]);
    return bot.calcMove(this.getDino(player), this.getDino(2), this);
  }

  calcTurn(i: number, p1move?: number, p2move?: number) {
    this.log("Turn " + i);
    this.log("p1move: " + p1move);
    this.log("p2move: " + p2move);
    // get last turn state
    const lastturn = this.turns[i - 1];
    const d1 = this.dino1;
    const d2 = this.dino2;

    d1.curstats = { ...lastturn.step2.d1stats };
    d2.curstats = { ...lastturn.step2.d2stats };
    d1.setCurMove(p1move);
    d2.setCurMove(p2move);
    // do stuff
    // who goes first?
    const first = this.checkFastest(d1, d2);
    const second = first === d1 ? d2 : d1;

    // first step: first Dino damages second Dino
    this.calcPly(first, second);
    const firstStep: Step = {
      d1stats: { ...d1.curstats },
      d2stats: { ...d2.curstats }
    };

    this.log(
      d1.getColoredName() + " has " + Math.ceil(d1.curstats.hp) + " hp."
    );
    this.log(
      d2.getColoredName() + " has " + Math.ceil(d2.curstats.hp) + " hp."
    );

    // second step: second Dino damages first Dino
    let secondStep: Step;
    if (second.isAlive()) {
      this.calcPly(second, first);
      secondStep = {
        d1stats: { ...d1.curstats },
        d2stats: { ...d2.curstats }
      };
      this.log(
        d1.getColoredName() + " has " + Math.ceil(d1.curstats.hp) + " hp."
      );
      this.log(
        d2.getColoredName() + " has " + Math.ceil(d2.curstats.hp) + " hp."
      );
    } else {
      secondStep = firstStep;
    }

    // save current turn state
    const curturn: Turn = {
      step1: firstStep,
      step2: secondStep,
      p1move: 0,
      p2move: 0
    };
    this.turns.push(curturn);
  }

  calcPly(attacker: Dino, defender: Dino) {
    attacker.checkPurges(defender);
    attacker.attack(defender);
    attacker.updateCooldowns();
    const stunned = attacker.isStunned();
    defender.updateBuffsFromTrigger(Trigger.defense);
    if (!stunned) {
      attacker.putCurMoveOnCooldown();
      defender.takeEffectsFromEnemy(attacker);
    }
    if (!defender.isStunned() && defender.shouldCounter) {
      defender.useCounter(attacker);
    }
    attacker.updateBuffsFromTrigger(Trigger.offense);
    // attacker.resetLuck();
  }

  // TODO: check draw, consider level, rarity
  private checkFastest(d1: Dino, d2: Dino): Dino {
    const d11st = d1.getIfCurMoveActsFirst();
    const d21st = d2.getIfCurMoveActsFirst();

    if (d11st && !d21st) {
      return d1;
    }
    if (d21st && !d11st) {
      return d2;
    }

    if (d1.curstats.speed > d2.curstats.speed) {
      return d1;
    } else if (d1.curstats.speed < d2.curstats.speed) {
      return d2;
    } else if (d1.curstats.speed == d2.curstats.speed) {
      if (d1.getLevel() > d2.getLevel()) {
        return d1;
      }
      if (d1.getLevel() < d2.getLevel()) {
        return d2;
      }
    }
    return d1;
  }

  private turnZero() {
    this.turns.push(this.newTurn());
    this.log("Battle begins");
    const d1 = this.dino1;
    const d2 = this.dino2;
    const text = `${d1.getColoredName()} (${d1.curstats.hp}hp ${
      d1.curstats.damage
    }dmg)
    versus
     ${d2.getColoredName()} (${d2.curstats.hp}hp ${d2.curstats.damage}dmg)`;
    this.log(text);
  }

  private newTurn(): Turn {
    return {
      step1: {
        d1stats: this.dino1.curstats,
        d2stats: this.dino2.curstats
      },
      step2: {
        d1stats: this.dino1.curstats,
        d2stats: this.dino2.curstats
      },
      p1move: 0,
      p2move: 0
    };
  }

  printTurn(round: number): string {
    const turn = this.turns[round];

    const d1 = this.dino1.getColoredName();
    const d2 = this.dino2.getColoredName();
    let result = "";
    if (round > 0) {
      result += "<br>Step 1<br>";
    }
    result += d1 + " hp: " + turn.step1.d1stats.hp;
    if (round === 0) {
      result += " damage: " + turn.step1.d1stats.damage;
    }
    result += "<br>";
    result += d2 + " hp: " + turn.step1.d2stats.hp;
    if (round === 0) {
      result += " damage: " + turn.step1.d2stats.damage;
    }
    if (round > 0) {
      result += "<br>Step 2<br>";
      result += d1 + " hp: " + turn.step2.d1stats.hp;
      result += "<br>";
      result += d2 + " hp: " + turn.step2.d2stats.hp;
    }
    return result;
  }

  printCombatlog(): string {
    let result = "";
    for (const i in this.combatlog) {
      if (this.combatlog.hasOwnProperty(i)) {
        result += i + ": " + this.combatlog[i];
        result += "<br>";
      }
    }
    return result;
  }
}

interface Turn {
  p1move: number;
  p2move: number;
  step1: Step;
  step2: Step;
}

interface Step {
  d1stats: CurStats;
  d2stats: CurStats;
}

export class Dino {
  private level = 26;
  private statsat26 = {
    hp: 0,
    damage: 0
  };
  basestats: BaseStats;
  curstats: CurStats;
  owner: number;
  private curmove: number;
  private battleref: Battle;
  fate = "random";
  shouldCounter = false;

  // get the name this dinosaur wrapped by HTML <span> tags with the CSS class to color it by rarity
  // if anchor? is true, then also wrap it by an <a> tag linking to this dino's profile page
  static getColoredName(name: string, anchor?: boolean): string {
    // console.log('get colored name of ' + name);

    let c = this.getColorClass(name);
    c = `<span class='${c}'>${name}</span>`;
    if (anchor) {
      c = `<a routerLink='/stats/velociraptor'>${c}</a>`;
    }
    return c;
  }

  static getColorClass(name: string): string {
    const r = this.findRarityName(name);
    // let c: string;
    // c = this.getRarityName(+r);
    return r;
  }

  // returns the rarity index of a dino with this name
  static findRarity(name: string): number {
    const dino = DINOS.find(d => d.name.toLowerCase() == name.toLowerCase());
    if (!dino) {
      return 0;
    }
    const rarity = dino.rarity;
    return rarity;
  }

  // returns the rarity name of a dino with this name
  static findRarityName(name: string): string {
    const dino = DINOS.find(d => d.name.toLowerCase() == name.toLowerCase());
    if (!dino) {
      return "";
    }
    const rarity = dino.rarity;
    let str: string;
    str = this.getRarityName(rarity);
    return str;
  }

  // returns the rarity name of a rarity with this index
  static getRarityName(index: number): string {
    // console.log('index is ' + index);

    const r = +index;
    let c: string;
    switch (r) {
      case 0:
        c = "common";
        break;
      case 1:
        c = "rare";
        break;
      case 2:
        c = "epic";
        break;
      case 3:
        c = "legendary";
        break;
      case 4:
        c = "unique";
        break;

      default:
        c = "r is: " + index;
        break;
    }
    return c;
  }

  static hasHybrid(name: string) {}

  static getHybrids(name: string): string[] {
    if (PARENTS[name]) {
      return PARENTS[name];
    }
    return undefined;
  }


  // returns how much DNA this dino needs to get to level up to this level
  static getDNAcost(dino: string, level: number): number {
    const rarity = Dino.findRarityName(dino);
    const cost = LEVELUP[rarity][level - 2];
    return cost;
  }

  // returns how much DNA a dino of this name needs to level up from level fromlevel to level tolevel
  static getDNAFromToName(dino: string, fromlevel: number, tolevel: number): number {
    const rarity = Dino.findRarity(dino);
    const cost = this.getDNAFromTo(rarity, fromlevel, tolevel);
    return cost;
  }

  // returns how much DNA a dino of this rarity needs to get to level up to this level
  static getDNAcostFromRarity(rarity: number, level: number): number {
    const cost = LEVELUP[this.getRarityName(rarity)][level - 2];
    return cost;
  }

  // returns how much DNA of ingdino, the hybrid dinosaur hybdino would need to get from level hybfromlvl to level hybtolevl
  static getIngcost(ingdino: string, inglevel: number, hybdino: string, hybfromlevel: number, hybtolevel: number): number {
    const ir = Dino.findRarity(ingdino); // rarity index of the ingredient
    const hr = Dino.findRarity(hybdino); // rarity index of the hybrid
    const delta = hr - ir; // difference in rarity between the 2
    const ingpow = LEVELUP["ing"][delta-1]; // how much DNA of the ingredient is needed per power up
    const hybcost = this.getDNAFromTo(hr, hybfromlevel, hybtolevel);
    const ingcost = hybcost * (ingpow/20);
    const reqlevel = LEVELUP["inglevel"][hr-1]; // required level for the ingredient
    const dnatoreq = this.getDNAFromTo(ir, inglevel, reqlevel); // DNA the ing needs to get to its min required level
    const total = ingcost + dnatoreq;
    // console.log(`ingdino: ${ingdino} reqlevel: ${reqlevel} dnatoreq: ${dnatoreq} ingcost: ${ingcost} total: ${total}`);
    return total;
  }

   // get the DNA a dino of this rarity would need from level fromlvl to level tolvl
  static getDNAFromTo(rarity: number, fromlvl: number, tolvl: number): number {
    if (fromlvl >= tolvl) { return 0; }
    let total = 0;
    for (let i = fromlvl + 1; i <= tolvl; i++) {
      total += this.getDNAcostFromRarity(rarity, i);
    }
    return total;
  }

  constructor(name: string, battle?: Battle) {
    let dino;
    dino = DINOS.find(e => e.name.toLowerCase() == name.toLowerCase());

    if (!dino) {
      throw new Error("Bad dino name: " + name);
    }

    this.battleref = battle;
    this.updateMoves(dino);
    // this.basestats = dino;
    this.basestats = {
      name: dino.name,
      rarity: +dino.rarity,
      hp: +dino.hp,
      armor: +dino.armor,
      damage: +dino.damage,
      crit: +dino.crit,
      speed: +dino.speed,
      moves: dino.moves,
      passive: dino.passive
    };
    this.statsat26.hp = this.basestats.hp;
    this.statsat26.damage = this.basestats.damage;
    this.iniCurStats();
  }

  getLevel(): number {
    return this.level;
  }

  setLevel(newlevel: number) {
    this.level = newlevel;
    this.basestats.hp = Math.ceil(this.statsat26.hp / 1.05 ** (26 - newlevel));
    this.basestats.damage = Math.ceil(
      this.statsat26.damage / 1.05 ** (26 - newlevel)
    );
    this.curstats.hp = this.basestats.hp;
    this.curstats.damage = this.basestats.damage;
    // console.log('new hp = ' + this.basestats.hp);

    // ROUNDUP( StatLevel26 / (1,05 ^ (26 - CurrentLevel) ); 0)
  }

  getStatAt26(stat: string): number {
    if (stat == "damage" || stat == "hp") {
      return this.statsat26[stat];
    }
    return this.basestats[stat];
  }

  private log(message: string) {
    this.battleref.log(message);
  }

  // copy stats from base stats into curstats
  private iniCurStats() {
    const b = this.basestats;
    this.curstats = {
      hp: +b.hp,
      armor: +b.armor,
      damage: +b.damage,
      crit: +b.crit,
      speed: +b.speed,
      cooldowns: [0, 0, 0, 0],
      buffs: [],
      debuffs: [],
      luck: []
    };
    this.setIniCooldownsFromDelays();
  }

  // in the beginning of the match, set the cooldown of each move to be that delay of that move
  setIniCooldownsFromDelays() {
    this.basestats.moves.forEach((m, i) => {
      this.curstats.cooldowns[i] = +m.delay;
    });
  }

  // updateBuffDurations() {
  //   this.curstats.debuffs.forEach(e => this.updateBuff(e, BuffType.debuff));
  //   this.curstats.buffs.forEach(e => this.updateBuff(e, BuffType.buff));

  //   this.updateStats();
  // }

  updateBuffsFromTrigger(trigger: Trigger) {
    this.curstats.debuffs.forEach(b => {
      if (b.trigger === trigger) {
        this.updateBuff(b, BuffType.debuff);
      }
    });
    this.curstats.debuffs = this.curstats.debuffs.filter(b => b.duration > 0);
    this.curstats.buffs.forEach(b => {
      if (b.trigger === trigger) {
        this.updateBuff(b, BuffType.buff);
      }
    });
    this.curstats.buffs = this.curstats.buffs.filter(b => b.duration > 0);

    this.updateStats();
  }

  updateCooldowns() {
    this.curstats.cooldowns = this.curstats.cooldowns.map(c =>
      Math.max(0, +c - 1)
    );
  }

  setLuck(type: string, luck: boolean, chance?: number) {
    if (!this.curstats.luck[type]) {
      this.curstats.luck[type] = { type: type, result: luck, chance: chance };
    } else {
      this.curstats.luck[type].result = luck;
      this.curstats.luck[type].chance = chance;
    }
    // console.log(this.curstats);
  }

  // if this luck type exists: rolls a random value between 0 and 100,
  // if it's lower than chance param record true on this luck type result, else record false
  rollLuck(type: string, chance: number) {
    const l = this.curstats.luck[type];
    if (!l || chance === undefined) {
      return;
    }
    const roll = Math.random() * 100;
    l.result = roll <= chance ? true : false;
    l.chance = chance;
    console.log(
      roll + " < " + l.chance + " roll for " + this.getName() + " " + type
    );
  }

  getStunChance(): number {
    if (this.curstats.luck["stun"]) {
      return this.curstats.luck["stun"].chance;
    }
    return 0;
  }

  // if no type is set roll all lucks of all types
  // if type is set, rolls only that luck type
  rollAllLuck(type?: string) {
    const chance = {
      crit: this.curstats.crit,
      stun: this.getStunChance(),
      dodge: 50
    };
    const types = ["crit", "stun"];
    if (!type) {
      types.forEach(t => this.rollLuck(t, chance[t]));
    } else {
      this.rollLuck(type, chance[type]);
    }
  }

  setAllProbableLuck(type?: string) {
    const chance = {
      crit: this.curstats.crit,
      stun: this.getStunChance(),
      dodge: 50
    };
    const types = ["crit", "stun"];
    if (!type) {
      types.forEach(t => this.rollProbable(t, chance[t]));
    } else {
      this.rollProbable(type, chance[type]);
    }
  }

  rollProbable(type: string, chance: number) {
    const l = this.curstats.luck[type];
    if (!l || chance === undefined) {
      return;
    }
    l.result = chance > 50 ? true : false;
    l.chance = chance;
  }

  // if type is set, sets the luck of all types to result using setLuck(type, result)
  // if no type is set, sets all lucks of all types
  setAllLuck(result: boolean, type?: string) {
    const types = ["crit", "stun"];
    if (type) {
      this.setLuck(type, result);
    } else {
      types.forEach(t => this.setLuck(t, result));
    }
  }

  // updates luck, based on fate, for that type if set, else update all luck for all types
  // if fate is random, uses the actual chance of each luck type and rolls a random value using rollLuck()
  // if fate is "no", sets luck to false, if "lucky" sets luck to true
  updateLuck(type?: string) {
    if (!this.curstats.luck["crit"]) {
      this.setLuck("crit", false);
    }
    switch (this.fate) {
      case "random":
        this.rollAllLuck(type);
        break;

      case "no":
        this.setAllLuck(false, type);
        break;

      case "lucky":
        this.setAllLuck(true, type);
        break;

      case "probable":
        this.setAllProbableLuck(type);
        break;

      default:
        break;
    }
  }

  // resetLuck() {
  //   console.log("resetting luck for " + this.getName());

  //   this.curstats.luck = [];
  // }

  setFate(fate: string) {
    this.fate = fate;
  }

  // buff is the buff to update, bufftype is a string to indicate if it's a "buffs" or "debuffs"
  private updateBuff(buff: Buff, bufftype: BuffType) {
    this.takeDotDamage(buff);
    buff.duration = Math.max(+buff.duration - 1, 0);
    if (+buff.duration === 0) {
      this.log(
        `${this.getColoredName()} no longer affected by a ${
          buff.type
        } ${bufftype.slice(0, -1)}`
      );
      // this.curstats[bufftype] = this.curstats[bufftype].filter(b => b !== buff);
      // TODO TEST IF DOUBLE STUNS LASTS TWICE
      // this.removeBuff(bufftype, buff);
    }
  }

  // apply buffs and debuffs to cur stats at the beginnig of a turn, or after taking dmg
  private updateStats() {
    this.curstats.damage =
      this.basestats.damage *
      (1 + this.getSumofDebuffs("damage")) *
      (1 + this.getSumofBuffs("damage"));
    this.curstats.speed =
      this.basestats.speed *
      (1 + this.getSumofDebuffs("speed")) *
      (1 + this.getSumofBuffs("speed"));

    const critd = this.getSumofDebuffs("crit");
    if (critd === 0) {
      const critsum = +(this.getSumofBuffs("crit") * 100);
      this.curstats.crit = +this.basestats.crit + critsum;
    } else {
      this.curstats.crit = 0;
    }
  }

  // checks if this buff is a dot
  // if it is, this Dino takes damage from the dot,
  // applies damage from damage recorded by the dot at the time it was applied
  private takeDotDamage(buff: Buff) {
    if (buff.type !== "dot") {
      return;
    }
    this.takeDamage(buff.value);
    this.log(
      `${this.getColoredName()} takes ${Math.ceil(
        buff.value
      )} damage from Damage Over Time.`
    );
  }

  private getSumofDebuffs(bufftype: string): number {
    let sum = 0;
    if (!this.curstats.debuffs) {
      return 0;
    }
    this.curstats.debuffs.forEach(e => {
      if (e.type === bufftype) {
        sum += e.value / 100;
      }
    });

    return sum;
  }

  private getSumofBuffs(bufftype: string): number {
    let sum = 0;
    if (!this.curstats.buffs) {
      return 0;
    }
    this.curstats.buffs.forEach(e => {
      if (e.type === bufftype) {
        sum += e.value / 100;
      }
    });

    return sum;
  }
  // need to transform the params 'move1', 'move2' etc from the loaded JSON to an array of moves
  private updateMoves(dino) {
    // do not update the moves if they have already been updated before
    // this can happen if you exit this route and come back to it
    // this method will already have updated the file loaded from the JSON
    if (dino.moves) {
      return;
    }
    dino.moves = [];
    this.moveToArray(dino, 1);
    this.moveToArray(dino, 2);
    this.moveToArray(dino, 3);
    this.moveToArray(dino, 4);
  }

  // this is needed because the JSON we loaded has a list of move names.
  // we need to get the actual Move objects from those
  private moveToArray(dino, i) {
    const movename: string = dino["move" + i];
    if (!movename) {
      return;
    }
    const move: Move = getMoveFromName(movename);
    dino.moves.push(move);
    delete dino["move" + i];
  }

  setCurMove(i: number) {
    this.curmove = i;
  }

  getCurMove(): Move {
    const move: Move = this.basestats.moves[this.curmove - 1];
    if (move) {
      return move;
    } else {
      return undefined;
    }
  }

  getCurMoveName(): string {
    const move: Move = this.basestats.moves[this.curmove - 1];
    if (move) {
      return move.name;
    } else {
      return undefined;
    }
  }

  // damage done by the current move. Current attack value multiplied by move multiplier
  getCurMoveDmg(): number {
    const move: Move = this.basestats.moves[this.curmove - 1];
    if (move) {
      return move.damage * this.curstats.damage;
    } else {
      return undefined;
    }
  }

  // returns true if the current move has innitiative to act first despite speed
  getIfCurMoveActsFirst(): boolean {
    const move = this.getCurMove();
    if (!move) {
      return true;
    }
    const effects = this.parseEffects(move.effect);
    if (!effects) {
      return false;
    }
    return effects.some(e => e.key === "first");
  }

  getName(): string {
    return this.basestats.name;
  }

  getColoredName(): string {
    const c = this.getColorClass();
    return `<span class='${c}'>${this.getName()}</span>`;
  }

  getColorClass(): string {
    const r = +this.basestats.rarity;
    let c: string;
    c = Dino.getRarityName(r);
    return c;
  }

  // called after I took direct damage
  // check if I have counter passive
  // let's the ply calc know that I'm read to use counter when it's time to
  private checkIfCounter(damage: number): any {
    // console.log('checking counter on ' + this.getName() + ' damage: ' + damage);

    if (
      damage > 0 &&
      this.basestats.passive &&
      this.basestats.passive.toLowerCase().includes("counter") &&
      this.isAlive()
    ) {
      this.shouldCounter = true;
    }
  }

  // use my counter attack on the enemy
  // called by ply calc
  useCounter(enemy: Dino) {
    if (!this.isAlive()) {
      return;
    }
    const move: Move = {
      name: "Counter " + this.getCounterMultiplier(),
      damage: this.getCounterMultiplier(),
      cooldown: 0,
      delay: 0,
      effect: "",
      duration: 0
    };
    this.shouldCounter = false;
    enemy.getAttackedByMove(move, this);
  }

  private getCounterMultiplier(): number {
    const s = this.basestats.passive.slice(7);
    let k = 1;
    switch (s) {
      case "025":
        k = 0.25;
        break;
      case "05":
        k = 0.5;
        break;

      default:
        break;
    }
    return k;
  }

  // check if my current move purges enemy positive effects
  // then apply the purges if so
  // called by calcply because purges need to be checked before doing damage
  checkPurges(enemy: Dino) {
    const move: Move = this.getCurMove();
    if (!move || this.isStunned()) {
      return;
    }
    const effects = this.parseEffects(move.effect);
    if (!effects) {
      return;
    }
    effects.forEach(e => {
      if (e) {
        this.purge(e, enemy);
      }
    });
  }

  private purge(effect: Effect, enemy: Dino) {
    const { key, value } = effect;
    if (key.toLowerCase() == "purge") {
      switch (value) {
        case "all":
          if (enemy.hasBuff("", BuffType.buff)) {
            this.log(
              `${this.getColoredName()} removes all buffs from ${enemy.getColoredName()}`
            );
            enemy.removeBuff(BuffType.buff);
          }
          break;

        case "shield":
          if (enemy.hasBuff("shield", BuffType.buff)) {
            if (!enemy.isImmune()) {
              this.log(
                `${this.getColoredName()} removes all shields from ${enemy.getColoredName()}`
              );
              enemy.removeBuffsByName("shield");
            } else {
              this.log(
                `${this.getColoredName()} tried to remove shields from ${enemy.getColoredName()}. But it was immune.`
              );
            }
          }
          break;

        default:
          break;
      }
    }
  }

  takeDamage(damage: number) {
    this.curstats.hp = Math.max(0, this.curstats.hp - damage);
  }

  takeEffectsFromEnemy(enemy: Dino) {
    const move: Move = enemy.getCurMove();
    if (!move) {
      return;
    }
    if (enemy.isStunned()) {
      return;
    }
    const effects = this.parseEffects(move.effect);
    this.takeEffects(effects, move.duration, enemy);
  }

  private takeEffects(effects: Effect[], duration: number, source: Dino) {
    if (!effects) {
      return;
    }
    effects.forEach(e => this.takeEffect(e, duration, source, effects));
    this.updateStats();
  }

  private takeEffect(
    effect: Effect,
    duration: number,
    source: Dino,
    effects: Effect[]
  ) {
    const { key, value } = effect;
    switch (key) {
      case "damage":
        if (value < 0 && source !== this) {
          // if it's a debuff
          this.log(
            this.getColoredName() +
              " is affected by damage debuff of " +
              value +
              "% for " +
              duration +
              " turns."
          );
          this.applyDebuff(key, +value, duration, Trigger.offense);
        } else if (value > 0 && source === this) {
          // if it's a buff
          this.log(
            this.getColoredName() +
              " gains damage buff of " +
              value +
              "% for " +
              duration +
              " turns."
          );
          this.applyBuff(key, +value, duration, Trigger.offense);
        }
        break;
      case "speed":
        const speedduration = effects.find(e => e.key == "speedduration");
        if (speedduration) {
          duration = speedduration.value;
        }
        if (value < 0 && source !== this) {
          this.log(
            this.getColoredName() +
              " is affected by speed debuff of " +
              value +
              "% for " +
              duration +
              " turns."
          );
          this.applyDebuff(key, +value, duration, Trigger.offense);
        } else if (value > 0 && source === this) {
          // if it's a buff
          this.log(
            this.getColoredName() +
              " gains speed buff of " +
              value +
              "% for " +
              duration +
              " turns."
          );
          this.applyBuff(key, +value, duration, Trigger.offense);
        }
        break;

      case "cleanse":
        if (value > 0 && source === this) {
          this.removeBuff(BuffType.debuff);
          this.log(`${this.getColoredName()} cleansed all debuffs.`);
        } else if (value <= 0 && source !== this) {
          this.removeBuff(BuffType.buff);
          this.log(
            `${source.getColoredName()} removes buffs from ${this.getColoredName()}`
          );
        }
        break;

      case "shield":
        if (value > 0 && source === this) {
          this.applyBuff(key, +value, duration, Trigger.defense);
          this.log(
            `${this.getColoredName()} gains a shield of ${value}% for ${duration} rounds.`
          );
        } else if (value === 0 && source !== this) {
          this.log(
            `${source.getColoredName()} removes shields from ${this.getColoredName()}`
          );
          this.removeBuffsByName("shield");
        }
        break;

      case "crit":
        if (value > 0 && source === this) {
          this.applyBuff(key, +value, duration, Trigger.offense);
          this.log(
            `${this.getColoredName()} gains a crit buff of ${value}% for ${duration} rounds.`
          );
        } else if (value === 0 && source !== this) {
          this.log(
            `${this.getColoredName()} cannot crit for ${duration} rounds.`
          );
          this.applyDebuff(key, -100, duration, Trigger.offense);
        }
        break;

      case "stun":
        if (source === this) {
          // triggers when you use an attack that has a stun
          // let it know I wanna stun this round
          // so later the updateLuck function will use this to decide
          // if I'll actually stun based on the stun chance and fate
          if (this.curstats.luck["stun"]) {
            this.curstats.luck["stun"].chance = value;
          } else {
            this.curstats.luck["stun"] = { type: "stun", chance: value };
          }

          // this.setLuck("stun", false, value);
        } else {
          // triggers when the enemy stuns you
          // apply the stun to self
          if (source.consumeLuck("stun")) {
            this.log(
              `${source.getColoredName()} stuns ${this.getColoredName()}.`
            );
            this.applyDebuff(key, +value, duration, Trigger.offense);
          }
        }
        break;

      case "vulnerable":
        if (source !== this) {
          this.log(
            `${source.getColoredName()} makes ${this.getColoredName()} vulnerable for ${duration} rounds.`
          );
          this.applyDebuff(key, +value, duration, Trigger.defense);
        }
        break;

      case "dot":
        if (source !== this) {
          const dmg = value * source.curstats.damage;
          this.log(
            `${this.getColoredName()} is affected by a Damage Over Time of ${Math.ceil(
              dmg
            )} damage for ${duration} rounds.`
          );
          this.applyDebuff(key, +dmg, duration, Trigger.offense);
        }
        break;

      case "dodge":
        if (source === this) {
          this.applyBuff("dodge", 1, +value, Trigger.defense);
          // this.applyBuff("damage", 100, 2, Trigger.offense);
          if (this.curstats.luck["dodge"]) {
            this.curstats.luck["dodge"].chance = 50;
          } else {
            this.curstats.luck["dodge"] = { type: "dodge", chance: 50 };
          }
          this.log(`${this.getColoredName()} gains Dodge for ${value} rounds.`);
          // this.log(`${this.getName()}'s next attack will deal double damage.`);
        }
        break;

      default:
        break;
    }
  }

  removeBuffsByName(name: string) {
    this.curstats["buffs"] = this.curstats["buffs"].filter(
      b => b.type !== name
    );
  }

  // removes buff of type ("buffs" or "debuffs") with this name, if no name is specified, dispells all
  removeBuff(type: BuffType, buff?: Buff) {
    // console.log('removing buff');
    // console.log("type: " + type);
    // console.log("buff: ");
    // console.log(buff);
    // console.log(this.curstats[type]);

    if (buff) {
      // removes every buff of the specified type
      // this.curstats[type] = this.curstats[type].filter(b => b.name !== name);
      this.curstats[type].splice(this.curstats[type].indexOf(buff), 1);
      // console.log(this.curstats[type]);
    } else {
      // removes every buff except cloak, which is not dispellable
      // this.curstats.buffs = this.curstats.buffs.filter(b => b.type === "cloak");
      // edit: GUESS NOT! REMOVE ALL THE THINGS!
      this.curstats[type] = [];
    }
  }

  // returns true if this creature is immune
  isImmune(): boolean {
    if (
      this.basestats.passive &&
      this.basestats.passive.toLowerCase() === "immune"
    ) {
      return true;
    }
    return false;
  }

  applyDebuff(buff: string, value: number, duration: number, trigger: Trigger) {
    if (this.isImmune()) {
      this.log(`But ${this.getColoredName()} was immune.`);
      return;
    }
    this.curstats.debuffs.push(new Buff(buff, value, duration, trigger));
  }

  applyBuff(buff: string, value: number, duration: number, trigger: Trigger) {
    this.curstats.buffs.push(new Buff(buff, value, duration, trigger));
  }

  parseEffects(effectstring: string): Effect[] {
    if (!effectstring) {
      return;
    }
    effectstring = effectstring.replace(/\s/g, ""); // removes whitespace
    if (!effectstring) {
      return [];
    } // stops if empty
    const listofstrings: string[] = effectstring.split(",");
    const effects: Effect[] = [];
    listofstrings.map(s => {
      const [k, v] = s.split("=");
      effects.push({ key: k, value: v });
    });

    return effects;
  }

  // returns true if this move with these effects has armor penetration and should ignore armor when doing damage.
  // False is this move has its damage reduced by armor
  hasArmorPen(effects: Effect[]): boolean {
    if (!effects) {
      return false;
    }
    return effects.some(e => e.key === "armor");
  }

  getLuck(type: string): boolean {
    const l = this.curstats.luck[type];
    return l ? l.result : false;
  }

  // gets the luck, remove it, returns result
  consumeLuck(type: string): boolean {
    const r = this.getLuck(type);
    this.removeLuck(type);
    return r;
  }

  removeLuck(type: string) {
    if (this.curstats.luck[type]) {
      delete this.curstats.luck[type];
    }
  }

  // returns if I'm affected by Vulnerable debuff
  isVulnerable(): boolean {
    return this.hasBuff("vulnerable", BuffType.debuff);
  }

  // returns true if I have a dodge buff and dodge luck is true
  didIdodge(): boolean {
    if (this.hasBuff("dodge", BuffType.buff)) {
      this.updateLuck("dodge");
      if (this.getLuck("dodge")) {
        return true;
      }
    }
    // console.log("check dodge for " + this.getName());
    // console.log(this.hasBuff("dodge", "buffs"));
    // console.log(this.getLuck("dodge"));
    return false;
  }

  // returns if this Dino has a buffordebuffs with this buffname
  // if buffname is "", then will return true if it has ANY buff
  hasBuff(buffname: string, bufftype: BuffType): boolean {
    if (!this.curstats[bufftype]) {
      return false;
    }
    if (buffname == "") {
      return this.curstats[bufftype].length > 0;
    }
    return this.curstats[bufftype].some(b => b.type === buffname);
  }

  getAttackedByMove(move: Move, attacker: Dino) {
    const effects = this.parseEffects(move.effect);
    if (move.damage > 0) {
      // if the move does damage
      const crit: boolean = attacker.consumeLuck("crit");
      let damage =
        move.damage *
        attacker.curstats.damage *
        this.getShieldMultiplier() *
        (crit ? 1.5 : 1);
      if (!this.hasArmorPen(effects)) {
        damage *= 1 - this.curstats.armor / 100;
      }
      if (this.isVulnerable()) {
        damage *= 1.25;
        // console.log(`${this.getName()} dmg taken increased`);
      }
      this.log(
        attacker.getColoredName() +
          " uses " +
          move.name +
          " against " +
          this.getColoredName() +
          " for " +
          Math.ceil(damage) +
          " damage." +
          (crit ? " CRIT" : "")
      );
      if (this.didIdodge()) {
        this.log(`But ${this.getColoredName()} dodges.`);
        return;
      }
      this.checkIfCounter(move.damage);
      this.takeDamage(damage);
    } else {
      // if move does not do damage
      this.log(
        attacker.getColoredName() +
          " uses " +
          move.name +
          " against " +
          this.getColoredName() +
          "."
      );
    }
  }

  isStunned(): boolean {
    if (this.curstats.debuffs.some(b => b.type === "stun")) {
      return true;
    }
    return false;
  }

  attack(enemy: Dino) {
    const move: Move = this.getCurMove();

    if (!move) {
      console.error(
        "Move does not exist. Move " + this.curmove + " on " + this.getName()
      );
      return;
    }
    if (this.getCurCooldown() > 0) {
      console.error(
        "Move is on cooldown. Move " +
          this.curmove +
          " on " +
          this.getName() +
          " cd left: " +
          this.getCurCooldown()
      );
      return;
    }
    if (!this.isStunned()) {
      const effects = this.parseEffects(move.effect);
      this.takeEffects(effects, move.duration, this);
      this.updateLuck();
      if (move.damage < 0) {
        this.healSelf(move);
      }
      enemy.getAttackedByMove(move, this);
    } else {
      this.log(`${this.getColoredName()} is stunned and cannot move.`);
    }
  }

  putCurMoveOnCooldown() {
    if (this.getCurMove()) {
      this.curstats.cooldowns[this.curmove - 1] = this.getCurMove().cooldown;
    }
  }

  getShieldMultiplier(): number {
    const buffs = this.curstats.buffs;
    let m = 1;
    buffs.forEach(b => {
      if (b.type === "shield") {
        m *= 1 - b.value / 100;
      }
    });
    return m;
  }

  healSelf(move: Move) {
    const ammount = -move.damage * this.basestats.hp;
    this.curstats.hp = Math.min(this.basestats.hp, this.curstats.hp + ammount);
    this.log(`${this.getColoredName()} heals for ${Math.ceil(ammount)}`);
  }

  getCurCooldown(): number {
    return this.curstats.cooldowns[this.curmove - 1];
  }
  getCooldown(move: number): number {
    return this.curstats.cooldowns[move - 1];
  }

  isAlive(): boolean {
    return this.curstats.hp > 0;
  }
}

export interface BaseStats {
  name: string;
  rarity: number;
  hp: number;
  armor: number;
  damage: number;
  crit: number;
  speed: number;
  moves: Move[];
  passive: string;
}

export interface CurStats {
  hp: number;
  armor: number;
  damage: number;
  crit: number;
  speed: number;
  cooldowns: number[];
  buffs: Buff[];
  debuffs: Buff[];
  luck: Luck[];
}

export interface Luck {
  type: string;
  result: boolean;
  chance: number;
}

class Buff {
  time = 0;

  constructor(
    public type: string,
    public value: number,
    public duration: number,
    public trigger: Trigger
  ) {}
}

// trigger: "offense" or "defense". offense buffs triggers and step their duration when the Dino attacks, defense when it takes hits
enum Trigger {
  offense,
  defense
}

enum BuffType {
  buff = "buffs",
  debuff = "debuffs"
}

export interface Effect {
  key: string;
  value: any;
}

export interface Move {
  name: string;
  damage: number;
  cooldown: number;
  delay: number;
  effect: string;
  duration: number;
}

function getMoveFromName(name: string): Move {
  if (name === undefined) {
    return undefined;
  }
  const move: Move = MOVES.find(e => e.name === name);
  if (!move) {
    console.log("error, cannot find Move named: " + name);
  }
  return move;
}
