// Bee tower stats. Range/splash in CELLS; times in MS.
// kind 'shooter' = picks a target each fireMs and damages it.
// kind 'support' = no fire; provides aura to nearby bees.
// kind 'generator' = produces honey every generateMs.

export const BEES = {
  worker: {
    id: 'worker', name: 'Worker', letter: 'W',
    cost: 50, hp: 60,
    kind: 'shooter',
    range: 3.5, fireMs: 600, damage: 8, splash: 0,
    target: 'globalClosestToHive',
    color: 0xffd24a, bulletColor: 0xfff2a0
  },
  soldier: {
    id: 'soldier', name: 'Soldier', letter: 'S',
    cost: 100, hp: 140,
    kind: 'shooter',
    range: 1.8, fireMs: 1100, damage: 32, splash: 0,
    target: 'globalClosestToHive',
    color: 0xffb030, bulletColor: 0xffd070
  },
  sniper: {
    id: 'sniper', name: 'Sniper', letter: 'Sn',
    cost: 150, hp: 50,
    kind: 'shooter',
    range: 9.0, fireMs: 1800, damage: 55, splash: 0,
    target: 'globalClosestToHive',
    color: 0xf0e0a0, bulletColor: 0xffffff
  },
  bomber: {
    id: 'bomber', name: 'Bomber', letter: 'B',
    cost: 125, hp: 70,
    kind: 'shooter',
    range: 3.5, fireMs: 1400, damage: 18, splash: 1.2,
    target: 'globalClosestToHive',
    color: 0xff7a30, bulletColor: 0xffaa50
  },
  queen: {
    id: 'queen', name: 'Queen', letter: 'Q',
    cost: 200, hp: 120,
    kind: 'support',
    range: 1.8, fireMs: 0, damage: 0, splash: 0,
    target: 'none',
    auraFireMult: 0.75,     // bees fire 25% faster
    auraDamageMult: 1.25,   // bees deal 25% more damage
    color: 0xffe4a0, bulletColor: 0xfff0c0
  },
  honeypot: {
    id: 'honeypot', name: 'Honeypot', letter: 'H',
    cost: 50, hp: 80,
    kind: 'generator',
    range: 0, fireMs: 0, damage: 0, splash: 0,
    target: 'none',
    generateMs: 4000, generateAmount: 25,
    color: 0xc8862a, bulletColor: 0xffd066
  },
  hornet: {
    id: 'hornet', name: 'Hornet', letter: 'Hr',
    cost: 200, hp: 70,
    kind: 'shooter',
    range: 4.5, fireMs: 450, damage: 10, splash: 0,
    target: 'globalClosestToHive',
    color: 0xff5030, bulletColor: 0xffaa30
  },
  stingerLord: {
    id: 'stingerLord', name: 'Stinger Lord', letter: 'Sl',
    cost: 250, hp: 110,
    kind: 'shooter',
    range: 5.0, fireMs: 1600, damage: 45, splash: 1.8,
    target: 'globalClosestToHive',
    color: 0x9050c0, bulletColor: 0xc090ff
  },
  bumblebee: {
    id: 'bumblebee', name: 'Bumblebee', letter: 'Bb',
    cost: 130, hp: 350,
    kind: 'shooter',
    range: 1.8, fireMs: 1500, damage: 60, splash: 0,
    target: 'firstInLane',
    color: 0xfcc844, bulletColor: 0xffe488
  },
  wasp: {
    id: 'wasp', name: 'Wasp', letter: 'Wp',
    cost: 225, hp: 50,
    kind: 'shooter',
    range: 6.5, fireMs: 700, damage: 14, splash: 0,
    target: 'globalClosestToHive',
    color: 0xffeb50, bulletColor: 0xffffaa
  },
  mortar: {
    id: 'mortar', name: 'Mortar Bee', letter: 'Mr',
    cost: 325, hp: 90,
    kind: 'shooter',
    range: 9.0, fireMs: 2400, damage: 90, splash: 2.5,
    target: 'globalClosestToHive',
    color: 0xff6b50, bulletColor: 0xffaa66
  }
};

// Display order for the HUD palette (also drives hotkeys 1..N).
export const BEE_ORDER = [
  'worker', 'soldier', 'sniper', 'bomber', 'queen', 'honeypot',
  'hornet', 'stingerLord', 'bumblebee', 'wasp', 'mortar'
];
