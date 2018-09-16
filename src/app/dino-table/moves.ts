export const MOVES: any[] = [
  {
    name: "Adrenaline Pulse",
    damage: "-0.25",
    cooldown: "3",
    delay: "0",
    effect: "first=1, cleanse=1"
  },
  { name: "Impact", damage: "1.5", cooldown: "2", delay: "0" },
  { name: "Strike", damage: "1", cooldown: "0", delay: "0" },
  { name: "Rampage", damage: "2", cooldown: "1", delay: "0" },
  {
    name: "Armor Piercing Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "armor=0"
  },
  {
    name: "Armor Piercing Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "armor=0"
  },
  {
    name: "Debilitating Distraction",
    damage: "1",
    cooldown: "3",
    delay: "1",
    effect: "damage=-75",
    duration: "2"
  },
  {
    name: "Decelerating Impact",
    damage: "1.5",
    cooldown: "1",
    delay: "0",
    effect: "speed=-50",
    duration: "2"
  },
  {
    name: "Defense Shattering Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "armor=0, purge=shield"
  },
  {
    name: "Defense Shattering Impact",
    damage: "1.5",
    cooldown: "1",
    delay: "0",
    effect: "armor=0, purge=shield"
  },
  {
    name: "Defense Shattering Rampage",
    damage: "2",
    cooldown: "1",
    delay: "1",
    effect: "armor=0, purge=shield"
  },
  {
    name: "Distracting Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "damage=-50",
    duration: "2"
  },
  {
    name: "Ferocious Strike",
    damage: "1",
    cooldown: "3",
    delay: "0",
    effect: "damage=50",
    duration: "3"
  },
  {
    name: "Ferocious Impact",
    damage: "1",
    cooldown: "3",
    delay: "0",
    effect: "damage=50",
    duration: "3"
  },
  {
    name: "Critical Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "crit=40",
    duration: "1"
  },
  {
    name: "Impairing Strike",
    damage: "1",
    cooldown: "2",
    delay: "0",
    effect: "crit=0",
    duration: "3"
  },
  {
    name: "Instant Cripple",
    damage: "0",
    cooldown: "1",
    delay: "0",
    effect: "first=1, damage=-90",
    duration: "1"
  },
  {
    name: "Instant Invencibility",
    damage: "0",
    cooldown: "3",
    delay: "1",
    effect: "first=1, shield=100",
    duration: "1"
  },
  {
    name: "Long Invencibility",
    damage: "0",
    cooldown: "4",
    delay: "0",
    effect: "shield=100",
    duration: "2"
  },
  {
    name: "Long Protection",
    damage: "1",
    cooldown: "4",
    delay: "0",
    effect: "shield=50",
    duration: "4"
  },
  {
    name: "Minimal Speedup Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "speed=10",
    duration: "3"
  },
  {
    name: "Minimal Stunning Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "stun=10",
    duration: "1"
  },
  {
    name: "Minor Stunning Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "stun=15",
    duration: "1"
  },
  {
    name: "Nullifying Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "purge=all"
  },
  {
    name: "Pounce",
    damage: "2",
    cooldown: "1",
    delay: "0",
    effect: "damage=-50",
    duration: "1"
  },
  {
    name: "Ready to Crush",
    damage: "0",
    cooldown: "2",
    delay: "",
    effect: "damage=50, crit=30",
    duration: "3"
  },
  {
    name: "Short Defense",
    damage: "1",
    cooldown: "2",
    delay: "0",
    effect: "shield=50",
    duration: "2"
  },
  {
    name: "Slowing Impact",
    damage: "1.5",
    cooldown: "4",
    delay: "0",
    effect: "speed=-50",
    duration: "3"
  },
  {
    name: "Strike And Run",
    damage: "1",
    cooldown: "1",
    delay: "1",
    effect: "swap=1"
  },
  {
    name: "Stunning Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "1",
    effect: "stun=33",
    duration: "1"
  },
  {
    name: "Thagomizer",
    damage: "1.5",
    cooldown: "3",
    delay: "0",
    effect: "speed=-50",
    duration: "3"
  },
  {
    name: "Vulnerability Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "vulnerable=25",
    duration: "1"
  },
  {
    name: "Distracting Strike",
    damage: "1",
    cooldown: "2",
    delay: "0",
    effect: "damage=-50",
    duration: "2"
  },
  {
    name: "Distracting Rampage",
    damage: "2",
    cooldown: "2",
    delay: "0",
    effect: "damage=-50",
    duration: "2"
  },
  {
    name: "Greater Stunning Strike",
    damage: "1",
    cooldown: "3",
    delay: "1",
    effect: "stun=75",
    duration: "1"
  },
  {
    name: "Greater Stunning Impact",
    damage: "1.5",
    cooldown: "3",
    delay: "1",
    effect: "stun=75",
    duration: "1"
  },
  {
    name: "Greater Stunning Rampage",
    damage: "2",
    cooldown: "3",
    delay: "1",
    effect: "stun=75",
    duration: "1"
  },
  {
    name: "Impact and Run",
    damage: "1.5",
    cooldown: "1",
    delay: "1",
    effect: "swap=1"
  },
  {
    name: "Rampage and Run",
    damage: "2",
    cooldown: "1",
    delay: "1",
    effect: "swap=1"
  },
  {
    name: "Low Stunning Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "stun=20",
    duration: "1"
  },
  {
    name: "Instant Charge",
    damage: "1",
    cooldown: "2",
    delay: "2",
    effect: "first=1, stun=75",
    duration: "1"
  },
  {
    name: "Adrenaline Surge",
    damage: "-0.25",
    cooldown: "3",
    delay: "0",
    effect: "first=1, cleanse=1, damage=25",
    duration: "4"
  },
  {
    name: "Nullifying Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "purge=all"
  },
  {
    name: "Pinning Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "swap=0",
    duration: "1"
  },
  {
    name: "Wounding Strike",
    damage: "1",
    cooldown: "1",
    delay: "0",
    effect: "dot=0.5",
    duration: "2"
  },
  {
    name: "Wounding Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "dot=0.5",
    duration: "2"
  },
  {
    name: "Exploit Wound",
    damage: "0",
    cooldown: "2",
    delay: "0",
    effect: "dot=1, vulnerable=25",
    duration: "2"
  },
  {
    name: "Expose Weak Spot",
    damage: "1",
    cooldown: "3",
    delay: "0",
    effect: "vulnerable=25",
    duration: "3"
  },
  {
    name: "Cleansing Impact",
    damage: "1.5",
    cooldown: "2",
    delay: "0",
    effect: "cleanse=1"
  },
  {
    name: "Armor Piercing Rampage",
    damage: "2",
    cooldown: "1",
    delay: "1",
    effect: "armor=0"
  },
  {
    name: "Strenghthening Strike",
    damage: "1",
    cooldown: "3",
    delay: "0",
    effect: "damage=50",
    duration: "2"
  },
  {
    name: "Cloak",
    damage: "0",
    cooldown: "3",
    delay: "0",
    effect: "dodge=2, first=1, damage=100",
    duration: "2"
  },
  {
    name: "Evasive Stance",
    damage: "0",
    cooldown: "3",
    delay: "0",
    effect: "dodge=3, first=1",
    duration: "3"
  },
  {
    name: "Lockdown Strike",
    damage: "1",
    cooldown: "1",
    delay: "0",
    effect: "swap=0",
    duration: "2"
  },
  {
    name: "Lockdown Impact",
    damage: "1.5",
    cooldown: "1",
    delay: "0",
    effect: "swap=0",
    duration: "2"
  },
  {
    name: "Extended Critical Strike",
    damage: "1",
    cooldown: "3",
    delay: "0",
    effect: "crit=60",
    duration: "3"
  },
  {
    name: "Lethal Wound",
    damage: "1",
    cooldown: "2",
    delay: "0",
    effect: "dot=0.66",
    duration: "3"
  },
  {
    name: "Superiority Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "cleanse=1, speed=-33",
    duration: "1"
  },
  {
    name: "Surprise Bellow",
    damage: "0",
    cooldown: "2",
    delay: "0",
    effect: "first=1, shield=50, speed=-50, speedduration=2",
    duration: "1"
  },
  {
    name: "Evasive Strike",
    damage: "1",
    cooldown: "0",
    delay: "0",
    effect: "dodge=1"
  }
];
