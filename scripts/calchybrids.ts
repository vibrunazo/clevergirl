import { DINOS } from "../src/app/dino-table/dinostats";

console.log('calcing hybrids');

const parents = {};
import fs = require('fs');

findAllHybrids();
// console.log(parents);
saveToFile();

function findAllHybrids() {
  DINOS.forEach(d => findHybridOfDino(d));
}

function findHybridOfDino(dino) {
  if (dino.ing1) {
    addHybrid(dino.ing1, dino.name);
  }
  if (dino.ing2) {
    addHybrid(dino.ing2, dino.name);
  }
}

function addHybrid(parent: string, hybrid: string) {
  if (!parents[parent]) { parents[parent] = []; }
  parents[parent].push(hybrid);
}

function saveToFile() {
  const path = './src/app/dino-table/parents.ts';
  const json = JSON.stringify(parents);
  const filetext = "export const PARENTS = " + json + ";";
  fs.writeFile(path, filetext, 'utf8', () => console.log('created json: ' + path));
}
