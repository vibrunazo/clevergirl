import { Bot } from "./bot";
import { Dino, Battle } from "../sim.module";

export class BasicBot extends Bot {

  calcMove(dino: Dino, enemy: Dino, battle: Battle): number {
    return 1;
  }

}
