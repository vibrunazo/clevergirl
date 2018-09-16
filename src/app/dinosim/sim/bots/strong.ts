import { Bot } from "./bot";
import { Dino, Battle, Move, Effect } from "../sim.module";

export class StrongBot extends Bot {
  scores: Score[] = [];
  battle: Battle;

  calcMove(dino: Dino, enemy: Dino, battle: Battle): number {
    this.battle = battle;
    const moves: Move[] = this.getAvaiableMoves(dino);
    const count = moves.length;
    if (count === 1) {
      return 1;
    }
    moves.forEach(m => this.calcMoveScore(m));
    const strongest = this.calcHighScore();

    const i = dino.basestats.moves.indexOf(strongest);

    return i + 1;
  }

  calcHighScore() {
    let bestscore = 0;
    let bestmove: Move;

    this.scores.forEach(s => {
      if (s.value > bestscore) {
        bestscore = s.value;
        bestmove = s.move;
      }
    });

    return bestmove;
  }

  calcMoveScore(move: Move) {
    let score = 0;
    score = +move.damage;

    const effects: Effect[] = this.battle.getDino(1).parseEffects(move.effect);
    score += this.calcEffects(effects, move.duration);
    this.scores.push({
      value: score,
      move: move
    });
  }

  calcEffects(effects: Effect[], duration): number {
    if (!effects) {
      return 0;
    }
    let score = 0;
    effects.forEach(e => (score += this.calcEffectScore(e, duration)));
    return score;
  }

  calcEffectScore(effect: Effect, duration: number): number {
    let score = 0;
    let value = 0;
    if (!duration) { duration = 0; }
    value = +effect.value;
    switch (effect.key) {
      case "speed":
        score = 2 * Math.abs(+value / 100) + duration * 0.2;
        break;

      case "dot":
        score = 0.5 * Math.abs(+value) + duration * 0.5;
        break;

      case "shield":
        if (+value > 0) {
          score = 0.5 + duration * 0.2;
        } else {
          score = 0.1;
        }

        break;

      case "stun":
        score = 1.5 * Math.abs(+value / 100);
        break;

      case "vulnerable":
        score = 0.25 + duration * 0.1;
        break;

      case "damage":
        score = Math.abs(+value / 100) + duration * 0.4;
        break;

      case "crit":
        if (+value > 0) {
          score = 0.5 * Math.abs(+value / 100) + duration * 0.3;
        } else {
          score = 0.1;
        }
        break;

      case "armor":
        score = 0.3;
        break;

      case "dodge":
        score = 4;
        break;

      default:
        score = 0;
        break;
    }
    return score;
  }
}

interface Score {
  value: number;
  move: Move;
}
