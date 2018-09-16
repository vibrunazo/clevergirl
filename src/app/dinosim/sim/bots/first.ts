import { Bot } from "./bot";
import { Dino, Battle, Move } from "../sim.module";

export class FirstBot extends Bot {
  calcMove(dino: Dino, enemy: Dino, battle: Battle): number {
    const moves: Move[] = this.getAvaiableMoves(dino);
    const count = moves.length;
    if (count === 1) {
      return 1;
    }

    const i = dino.basestats.moves.indexOf(moves[1]);

    return i + 1;
  }
}
