import { Bot } from "./bot";
import { Dino, Battle, Move } from "../sim.module";

export class RandomBot extends Bot {
  calcMove(dino: Dino, enemy: Dino, battle: Battle): number {

    const moves: Move[] = this.getAvaiableMoves(dino);
    const count = moves.length;

    if (count === 1) {
      return 1;
    }

    const roll = Math.floor(Math.random() * count);
    const i = dino.basestats.moves.indexOf(moves[roll]);

    return i + 1;
  }
}
