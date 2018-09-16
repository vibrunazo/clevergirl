import { Dino, Battle, Move } from "../sim.module";

export abstract class Bot {
  getAvaiableMoves(dino: Dino): Move[] {
    const moves: Move[] = [];
    dino.curstats.cooldowns.forEach((cd, i) => {
      if (+cd === 0 && dino.basestats.moves[i]) {
          moves.push(dino.basestats.moves[i]);
      }
    });

    return moves;
  }

  abstract calcMove(dino: Dino, enemy: Dino, battle: Battle): number;

  // abstract makeSound(input : string) : string;
}
