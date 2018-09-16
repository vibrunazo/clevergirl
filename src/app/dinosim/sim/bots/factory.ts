import { Bot } from "./bot";
import { BasicBot } from "./basic";
import { RandomBot } from "./random";
import { StrongBot } from "./strong";
import { FirstBot } from "./first";

export class BotFactory {
  static getBotFromName(name: string): Bot {
    const botname = name.split("-")[1];
    let bot: Bot;
    switch (botname) {
      case "basic":
        bot = new BasicBot();
        break;

      case "first":
        bot = new FirstBot();
        break;

      case "random":
        bot = new RandomBot();
        break;

      case "strong":
        bot = new StrongBot();
        break;

      default:
        break;
    }
    return bot;
  }
}
