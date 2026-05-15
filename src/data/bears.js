// Bear enemy stats. speed in px/sec; times in ms; r is collision radius in px.

export const BEARS = {
  cub: {
    id: 'cub', name: 'Cub',
    hp: 30, speed: 42, meleeMs: 700, meleeDmg: 6, bounty: 5,
    color: 0x8a5a2a, headColor: 0x9a6a3a, r: 14
  },
  brown: {
    id: 'brown', name: 'Brown',
    hp: 80, speed: 28, meleeMs: 900, meleeDmg: 10, bounty: 10,
    color: 0x6b3a1f, headColor: 0x7b4a2a, r: 18
  },
  grizzly: {
    id: 'grizzly', name: 'Grizzly',
    hp: 220, speed: 18, meleeMs: 1100, meleeDmg: 18, bounty: 15,
    color: 0x4a2a14, headColor: 0x5a3a20, r: 22
  },
  honeybadger: {
    id: 'honeybadger', name: 'Honey Badger',
    hp: 90, speed: 55, meleeMs: 800, meleeDmg: 8, bounty: 15,
    stunMs: 1500, stunCooldownMs: 5000,
    color: 0x202020, headColor: 0xe0e0e0, r: 16
  },
  boss: {
    id: 'boss', name: 'Bear Boss',
    hp: 3600, speed: 25, meleeMs: 1200, meleeDmg: 9999, bounty: 100,
    color: 0x2a1408, headColor: 0x3a2010, r: 90
  },
  panda: {
    id: 'panda', name: 'Panda',
    hp: 180, speed: 25, meleeMs: 1000, meleeDmg: 25, bounty: 25,
    color: 0xfafafa, headColor: 0xffffff, r: 28
  },
  // --- Evil bees (Hive map) ---
  drone: {
    id: 'drone', name: 'Drone', isBee: true,
    hp: 50, speed: 48, meleeMs: 600, meleeDmg: 8, bounty: 8,
    color: 0xffd24a, accentColor: 0x2a1500, r: 14
  },
  striker: {
    id: 'striker', name: 'Striker', isBee: true,
    hp: 130, speed: 38, meleeMs: 800, meleeDmg: 14, bounty: 12,
    color: 0xffa030, accentColor: 0x2a1500, r: 18
  },
  vespid: {
    id: 'vespid', name: 'Vespid', isBee: true,
    hp: 320, speed: 22, meleeMs: 1000, meleeDmg: 24, bounty: 20,
    color: 0xff5030, accentColor: 0x000000, r: 22
  },
  darkQueen: {
    id: 'darkQueen', name: 'Dark Queen', isBee: true,
    hp: 8000, speed: 14, meleeMs: 1200, meleeDmg: 9999, bounty: 300,
    color: 0x6020a0, accentColor: 0xff0044, r: 100
  }
};
