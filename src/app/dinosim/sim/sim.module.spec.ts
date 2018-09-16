import { SimModule, Battle, CurStats, BaseStats } from "./sim.module";
import { log } from "util";

describe("SimModule", () => {
  let simModule: SimModule;

  beforeEach(() => {
    simModule = new SimModule();
  });

  it("should create an instance", () => {
    expect(simModule).toBeTruthy();
  });

  it("should start a battle", () => {
    battle = new Battle("Allosaurus", "Stegosaurus");
    expect(battle).toBeTruthy();
  });

  it("basic attack works", () => {
    battle = new Battle("Allosaurus", "Stegosaurus");
    setupBattle();
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d2dmg);
    expect(getDmgTaken(2)).toEqual(d1dmg);
  });

  it("armor works", () => {
    battle = new Battle("Einiasuchus", "Stegosaurus");
    setupBattle();
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d2dmg * (1 - d1armor / 100));
    expect(getDmgTaken(2)).toEqual(d1dmg * (1 - d2armor / 100));
  });

  it("pounce works", () => {
    battle = new Battle("Velociraptor", "Apatosaurus");
    setupBattle();
    battle.nextTurn(2, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual((d2dmg * (1 - d1armor / 100)) / 2);
    expect(getDmgTaken(2)).toEqual(d1dmg * (1 - d2armor / 100) * 2);
  });

  it("slow with pounce works", () => {
    battle = new Battle("Velociraptor", "Apatosaurus");
    setupBattle();
    // turn 1, velociraptor should do damage first
    battle.nextTurn(2, 2);
    updateStats();

    expect(getStep1DmgTaken(1)).toEqual(0);
    expect(getStep1DmgTaken(2)).toEqual(d1dmg * (1 - d2armor / 100) * 2);

    expect(getStep2DmgTaken(1)).toEqual(
      (d2dmg * (1 - d1armor / 100) * 1.5) / 2
    );
    expect(getStep2DmgTaken(2)).toEqual(0);

    // turn 2, apato should do damage first
    battle.nextTurn(1, 1);
    updateStats();

    expect(getStep1DmgTaken(1)).toEqual(d2dmg + (d2dmg * 1.5) / 2);
    expect(getStep1DmgTaken(2)).toEqual(d1dmg * 2);
  });

  it("vulnerability works", () => {
    battle = new Battle("Euoplocephalus", "Apatosaurus");
    setupBattle();
    // turn 1,
    battle.nextTurn(1, 1);
    updateStats();

    const d1r1 = d2dmg * (1 - d1armor / 100) * 1;
    expect(getDmgTaken(1)).toEqual(d1r1);
    expect(getDmgTaken(2)).toEqual(d1dmg);

   // turn 2
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d1r1 * 2);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25);

    // turn 3
    battle.nextTurn(2, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d1r1 * 3);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25 + d1dmg * 1.25 * 1.5);

    // turn 4
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d1r1 * 4);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25 + d1dmg * 1.25 * 1.5 + d1dmg);
  });

  it("vulnerability with slow", () => {
    battle = new Battle("Euoplocephalus", "Apatosaurus");
    setupBattle();
    // turn 1,
    battle.nextTurn(1, 2);
    updateStats();

    const d1r1 = d2dmg * (1 - d1armor / 100) * 1.5;
    expect(getDmgTaken(1)).toEqual(d1r1);
    expect(getDmgTaken(2)).toEqual(d1dmg);

    // turn 2
    battle.nextTurn(1, 1);
    updateStats();

    const d1r2 = d2dmg * (1 - d1armor / 100) * 1;
    expect(getDmgTaken(1)).toEqual(d1r1 + d1r2);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25);

    // turn 3
    battle.nextTurn(2, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d1r1 + d1r2 * 2);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25 + d1dmg * 1.25 * 1.5);

    // turn 4
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toEqual(d1r1 + d1r2 * 3);
    expect(getDmgTaken(2)).toEqual(d1dmg + d1dmg * 1.25 + d1dmg * 1.25 * 1.5 + d1dmg);
  });

  it("stun works", () => {
    battle = new Battle("Sinoceratops", "Apatosaurus");
    setupBattle();
    battle.getDino(1).setFate("manual");
    // turn 1,
    battle.nextTurn(1, 1);
    updateStats();

    expect(getDmgTaken(1)).toBeGreaterThan(0);
    expect(getDmgTaken(2)).toBeGreaterThan(0);

    // turn 2
    battle.getDino(1).setLuck("stun", true);
    battle.nextTurn(1, 1);
    updateStats();

    expect(getTurnDmgTaken(1)).toEqual(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);

    // turn 3
    battle.nextTurn(3, 1);
    updateStats();

    expect(getTurnDmgTaken(1)).toBeGreaterThan(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);

    // turn 4
    battle.getDino(1).setLuck("stun", true);
    battle.nextTurn(2, 1);
    updateStats();

    expect(getTurnDmgTaken(1)).toEqual(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);
  });

  it("stun with slow", () => {
    battle = new Battle("Sinoceratops", "Apatosaurus");
    setupBattle();
    battle.getDino(1).setFate("manual");
    // turn 1,
    battle.getDino(1).setLuck("stun", true);
    battle.nextTurn(1, 2);
    updateStats();

    expect(getDmgTaken(1)).toEqual(0);
    expect(getDmgTaken(2)).toBeGreaterThan(0);
    expect(battle.getDino(1).curstats.debuffs.length).toEqual(0);


    // turn 2
    battle.nextTurn(1, 2);
    updateStats();

    expect(getTurnDmgTaken(1)).toBeGreaterThan(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);

    // turn 3
    battle.nextTurn(3, 1);
    updateStats();

    expect(getTurnDmgTaken(1)).toBeGreaterThan(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);

    // turn 4
    battle.getDino(1).setLuck("stun", true);
    battle.nextTurn(2, 1);
    updateStats();

    expect(getTurnDmgTaken(1)).toBeGreaterThan(0);
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0);
    expect(battle.getDino(2).curstats.debuffs.length).toEqual(1);
  });

  it("dot works", () => {
    battle = new Battle("Spinosaurus", "Apatosaurus");
    setupBattle();
    // turn 1,
    battle.nextTurn(2, 1);
    updateStats();

    expect(getDmgTaken(1)).toBeGreaterThan(0, "r1 d1");
    expect(getDmgTaken(2)).toBeGreaterThan(0, "r1 d2");
    const num = battle.getDino(2).curstats.debuffs.length;
    expect(battle.getDino(2).curstats.debuffs.length).toBeGreaterThan(0, "r1 d2 num dot");

    // turn 2
    battle.nextTurn(10, 10);
    updateStats();

    expect(getTurnDmgTaken(1)).toEqual(0, "r2 d1");
    expect(getTurnDmgTaken(2)).toBeGreaterThan(0, "r2 d2");
    expect(getStep1(2).debuffs.length).toBeGreaterThan(0, "r2 d2 step1 num dot");
    expect(getState(2).debuffs.length).toEqual(0, "r2 d2 step2 num dot");

    // turn 3
    battle.nextTurn(10, 10);
    updateStats();

    expect(getTurnDmgTaken(1)).toEqual(0, "r3 d1");
    expect(getTurnDmgTaken(2)).toEqual(0, "r3 d3");
    expect(battle.getDino(2).curstats.debuffs.length).toEqual(0, "r3 d2 num dot");

  });
});

let battle: Battle;
let d1state: CurStats;
let d1step1: CurStats;
let d1stats: BaseStats;
let d2state: CurStats;
let d2step1: CurStats;
let d2stats: BaseStats;

let d1dmg: number;
let d2dmg: number;
let d1armor: number;
let d2armor: number;

function setupBattle() {
  battle.setupPlayers("you", "you");
  battle.getDino(1).setFate("no");
  battle.getDino(2).setFate("no");
}

function updateStats() {
  d1state = battle.getCurDinoState(1);
  d1step1 = battle.getStep1State(1);
  d1stats = battle.getDinoStats(1);
  d2state = battle.getCurDinoState(2);
  d2step1 = battle.getStep1State(2);
  d2stats = battle.getDinoStats(2);

  d2dmg = +getStats(2).damage;
  d1armor = +getStats(1).armor;
  d2armor = +getStats(2).armor;
  d1dmg = +getStats(1).damage;
}

function getDmgTaken(dino: number): number {
  return getStats(dino).hp - getState(dino).hp;
}

function getTurnDmgTaken(dino: number): number {
  return battle.getDamageTakenCurTurn(dino);
}

function getStep1DmgTaken(dino: number): number {
  return getStats(dino).hp - getStep1(dino).hp;
}

function getStep2DmgTaken(dino: number): number {
  return getStep1(dino).hp - getState(dino).hp;
}

function getStats(dino: number) {
  return dino === 1 ? d1stats : d2stats;
}

function getState(dino: number) {
  return dino === 1 ? d1state : d2state;
}

function getStep1(dino: number) {
  return dino === 1 ? d1step1 : d2step1;
}
