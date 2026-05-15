// Per-map wave lists. Each wave: { spawns: [{ at, type, lane? }] }
// `at` is ms within the wave; `lane` is optional (random if unset).

const GARDEN = [
  // W1 — gentle intro.
  { spawns: [
    { at:   500, type: 'cub' },
    { at:  4000, type: 'cub' }
  ]},
  // W2 — cub swarm + brown.
  { spawns: [
    { at:   500, type: 'cub' },
    { at:  2500, type: 'cub' },
    { at:  4500, type: 'cub' },
    { at:  7500, type: 'brown' }
  ]},
  // W3 — more browns.
  { spawns: [
    { at:   500, type: 'cub' },
    { at:  2000, type: 'cub' },
    { at:  4500, type: 'brown' },
    { at:  7500, type: 'brown' },
    { at: 10500, type: 'cub' },
    { at: 12500, type: 'cub' }
  ]},
  // W4 — first honey badger.
  { spawns: [
    { at:   500, type: 'brown' },
    { at:  3500, type: 'honeybadger' },
    { at:  6500, type: 'brown' },
    { at:  9000, type: 'cub' }, { at: 9000, type: 'cub' },
    { at: 12500, type: 'brown' }
  ]},
  // W5 — multi-lane browns + badgers.
  { spawns: [
    { at:   500, type: 'brown', lane: 0 }, { at: 500, type: 'brown', lane: 4 },
    { at:  4000, type: 'honeybadger' }, { at: 4500, type: 'honeybadger' },
    { at:  8000, type: 'brown' }, { at: 8000, type: 'cub' },
    { at: 12000, type: 'brown' }
  ]},
  // W6 — Garden finale: first grizzly.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  3500, type: 'brown' }, { at: 3500, type: 'brown' },
    { at:  7500, type: 'honeybadger' }, { at: 8000, type: 'honeybadger' },
    { at: 11500, type: 'cub' }, { at: 11700, type: 'cub' }, { at: 11900, type: 'cub' },
    { at: 14500, type: 'brown' }
  ]}
];

const PLAYGROUND = [
  // W1 — straight to browns.
  { spawns: [
    { at:   500, type: 'brown' },
    { at:  3000, type: 'brown' },
    { at:  6000, type: 'cub' }, { at: 6200, type: 'cub' }, { at: 6400, type: 'cub' },
    { at:  9500, type: 'brown' }
  ]},
  // W2 — first grizzly.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  4000, type: 'brown' }, { at: 4000, type: 'brown' },
    { at:  8000, type: 'honeybadger' },
    { at: 11000, type: 'cub' }, { at: 11200, type: 'cub' }
  ]},
  // W3 — honey badger flurry.
  { spawns: [
    { at:   500, type: 'honeybadger' }, { at: 700, type: 'honeybadger' },
    { at:  3500, type: 'brown' }, { at: 3500, type: 'brown' },
    { at:  7000, type: 'grizzly' },
    { at: 10000, type: 'honeybadger' },
    { at: 13000, type: 'brown' }
  ]},
  // W4 — two grizzlies, opposite lanes.
  { spawns: [
    { at:   500, type: 'grizzly', lane: 0 },
    { at:   500, type: 'grizzly', lane: 4 },
    { at:  5000, type: 'cub' }, { at: 5100, type: 'cub' }, { at: 5200, type: 'cub' }, { at: 5300, type: 'cub' },
    { at:  9500, type: 'brown' }, { at: 9500, type: 'brown' },
    { at: 13500, type: 'honeybadger' }
  ]},
  // W5 — chaos.
  { spawns: [
    { at:   500, type: 'brown' }, { at: 800, type: 'brown' },
    { at:  3500, type: 'honeybadger' }, { at: 3700, type: 'honeybadger' },
    { at:  6500, type: 'grizzly' },
    { at:  9500, type: 'brown' }, { at: 9700, type: 'brown' }, { at: 9900, type: 'brown' },
    { at: 13000, type: 'grizzly' }
  ]},
  // W6 — Playground finale.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  2500, type: 'grizzly' },
    { at:  5500, type: 'honeybadger' }, { at: 5700, type: 'honeybadger' }, { at: 5900, type: 'honeybadger' },
    { at:  9500, type: 'brown' }, { at: 9500, type: 'brown' }, { at: 9500, type: 'brown' },
    { at: 13500, type: 'grizzly' }
  ]}
];

const SANDPIT = [
  // W1 — grizzly + browns.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  3000, type: 'brown' }, { at: 3200, type: 'brown' },
    { at:  6500, type: 'honeybadger' },
    { at:  9500, type: 'brown' }, { at: 9700, type: 'brown' }
  ]},
  // W2 — two grizzlies + badgers.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at:  4500, type: 'honeybadger' }, { at: 4700, type: 'honeybadger' }, { at: 4900, type: 'honeybadger' },
    { at:  8500, type: 'brown' }, { at: 8500, type: 'brown' }
  ]},
  // W3 — three grizzlies + cub swarm.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  3000, type: 'grizzly' },
    { at:  5500, type: 'grizzly' },
    { at:  8500, type: 'cub' }, { at: 8600, type: 'cub' }, { at: 8700, type: 'cub' },
    { at:  8800, type: 'cub' }, { at: 8900, type: 'cub' }, { at: 9000, type: 'cub' },
    { at: 12500, type: 'brown' }
  ]},
  // W4 — multi-lane grizzly push.
  { spawns: [
    { at:   500, type: 'grizzly', lane: 0 },
    { at:   500, type: 'grizzly', lane: 2 },
    { at:   500, type: 'grizzly', lane: 4 },
    { at:  5500, type: 'honeybadger' }, { at: 5700, type: 'honeybadger' },
    { at:  9500, type: 'brown' }, { at: 9500, type: 'brown' }, { at: 9500, type: 'brown' }
  ]},
  // W5 — relentless.
  { spawns: [
    { at:   500, type: 'grizzly' },
    { at:  2500, type: 'honeybadger' }, { at: 2700, type: 'honeybadger' },
    { at:  5000, type: 'grizzly' },
    { at:  7500, type: 'brown' }, { at: 7700, type: 'brown' }, { at: 7900, type: 'brown' }, { at: 8100, type: 'brown' },
    { at: 11500, type: 'grizzly' },
    { at: 14000, type: 'honeybadger' }
  ]},
  // W6 — THE BOSS.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at:  4000, type: 'honeybadger' }, { at: 4200, type: 'honeybadger' }, { at: 4400, type: 'honeybadger' },
    { at:  7500, type: 'brown' }, { at: 7500, type: 'brown' }, { at: 7500, type: 'brown' },
    { at: 11500, type: 'grizzly' },
    { at: 15500, type: 'boss' }
  ]}
];

const CAVE = [
  // W1 — opening already harder than Sandpit's: two grizzlies + badger pressure.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at:  3500, type: 'honeybadger' }, { at: 3700, type: 'honeybadger' },
    { at:  7000, type: 'brown' }, { at: 7200, type: 'brown' }, { at: 7400, type: 'brown' },
    { at: 10500, type: 'grizzly' }
  ]},
  // W2 — triple grizzlies + badger swarm.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' }, { at: 900, type: 'grizzly' },
    { at:  4500, type: 'honeybadger' }, { at: 4700, type: 'honeybadger' },
    { at:  4900, type: 'honeybadger' }, { at: 5100, type: 'honeybadger' },
    { at:  9500, type: 'brown' }, { at: 9700, type: 'brown' },
    { at: 13500, type: 'grizzly' }
  ]},
  // W3 — early BOSS appearance.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at:  4500, type: 'honeybadger' }, { at: 4700, type: 'honeybadger' },
    { at:  8000, type: 'boss' },
    { at: 13500, type: 'brown' }, { at: 13700, type: 'brown' }, { at: 13900, type: 'brown' },
    { at: 17500, type: 'grizzly' }
  ]},
  // W4 — five-lane grizzly assault.
  { spawns: [
    { at:   500, type: 'grizzly', lane: 0 },
    { at:   500, type: 'grizzly', lane: 2 },
    { at:   500, type: 'grizzly', lane: 4 },
    { at:  4500, type: 'grizzly', lane: 1 },
    { at:  4500, type: 'grizzly', lane: 3 },
    { at:  9000, type: 'honeybadger' }, { at: 9200, type: 'honeybadger' },
    { at:  9400, type: 'honeybadger' }, { at: 9600, type: 'honeybadger' },
    { at: 13500, type: 'brown' }, { at: 13500, type: 'brown' }, { at: 13500, type: 'brown' }
  ]},
  // W5 — boss right away, then waves of support.
  { spawns: [
    { at:   500, type: 'boss' },
    { at:  4500, type: 'grizzly' }, { at: 4700, type: 'grizzly' },
    { at:  8500, type: 'honeybadger' }, { at: 8700, type: 'honeybadger' }, { at: 8900, type: 'honeybadger' },
    { at: 12500, type: 'brown' }, { at: 12500, type: 'brown' },
    { at: 12500, type: 'brown' }, { at: 12500, type: 'brown' },
    { at: 16500, type: 'grizzly' }, { at: 16700, type: 'grizzly' }
  ]},
  // W6 — THE CAVE FINALE: double boss, full chaos.
  { spawns: [
    { at:   500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at:  4500, type: 'honeybadger' }, { at: 4700, type: 'honeybadger' },
    { at:  4900, type: 'honeybadger' }, { at: 5100, type: 'honeybadger' },
    { at:  8000, type: 'boss' },
    { at: 13500, type: 'brown' }, { at: 13700, type: 'brown' },
    { at: 13900, type: 'brown' }, { at: 14100, type: 'brown' },
    { at: 17500, type: 'grizzly' }, { at: 17700, type: 'grizzly' },
    { at: 21500, type: 'boss' }
  ]}
];

// The Ice — pandas only. Slow, tough, and they keep coming.
const ICE = [
  // W1 — a handful, gentle intro.
  { spawns: [
    { at:   500, type: 'panda' },
    { at:  3500, type: 'panda' },
    { at:  6500, type: 'panda' },
    { at:  9500, type: 'panda' }
  ]},
  // W2 — six pandas, drifting in.
  { spawns: [
    { at:   500, type: 'panda' }, { at: 700, type: 'panda' },
    { at:  4500, type: 'panda' }, { at: 4700, type: 'panda' },
    { at:  9500, type: 'panda' }, { at: 9700, type: 'panda' }
  ]},
  // W3 — eight pandas across more lanes.
  { spawns: [
    { at:   500, type: 'panda' }, { at: 700, type: 'panda' }, { at: 900, type: 'panda' },
    { at:  5500, type: 'panda' }, { at: 5700, type: 'panda' },
    { at: 10000, type: 'panda' }, { at: 10200, type: 'panda' }, { at: 10400, type: 'panda' }
  ]},
  // W4 — ten pandas, denser packs.
  { spawns: [
    { at:   500, type: 'panda' }, { at: 700, type: 'panda' }, { at: 900, type: 'panda' },
    { at:  4500, type: 'panda' }, { at: 4700, type: 'panda' }, { at: 4900, type: 'panda' }, { at: 5100, type: 'panda' },
    { at:  9500, type: 'panda' }, { at: 9700, type: 'panda' }, { at: 9900, type: 'panda' }
  ]},
  // W5 — twelve pandas, multi-lane.
  { spawns: [
    { at:   500, type: 'panda', lane: 0 }, { at: 500, type: 'panda', lane: 2 }, { at: 500, type: 'panda', lane: 4 },
    { at:  4500, type: 'panda' }, { at: 4700, type: 'panda' }, { at: 4900, type: 'panda' }, { at: 5100, type: 'panda' },
    { at:  9000, type: 'panda' }, { at: 9200, type: 'panda' },
    { at: 13000, type: 'panda' }, { at: 13200, type: 'panda' }, { at: 13400, type: 'panda' }
  ]},
  // W6 — the Ice finale: a fifteen-panda avalanche.
  { spawns: [
    { at:   500, type: 'panda', lane: 0 }, { at: 500, type: 'panda', lane: 1 },
    { at:   500, type: 'panda', lane: 2 }, { at: 500, type: 'panda', lane: 3 }, { at: 500, type: 'panda', lane: 4 },
    { at:  5500, type: 'panda' }, { at: 5700, type: 'panda' }, { at: 5900, type: 'panda' },
    { at:  6100, type: 'panda' }, { at: 6300, type: 'panda' },
    { at: 11500, type: 'panda' }, { at: 11700, type: 'panda' },
    { at: 11900, type: 'panda' }, { at: 12100, type: 'panda' }, { at: 12300, type: 'panda' }
  ]}
];

// The Hive — evil bees only, culminating in the Dark Queen.
const HIVE = [
  // W1 — drone scouts.
  { spawns: [
    { at:   500, type: 'drone' }, { at: 1500, type: 'drone' },
    { at:  3500, type: 'drone' }, { at: 5500, type: 'drone' },
    { at:  8000, type: 'striker' }
  ]},
  // W2 — strikers join in.
  { spawns: [
    { at:   500, type: 'drone' }, { at: 700, type: 'drone' },
    { at:  3500, type: 'striker' }, { at: 5500, type: 'striker' },
    { at:  8500, type: 'drone' }, { at: 8700, type: 'drone' },
    { at: 12000, type: 'striker' }
  ]},
  // W3 — first vespid.
  { spawns: [
    { at:   500, type: 'striker' }, { at: 700, type: 'striker' },
    { at:  4500, type: 'vespid' },
    { at:  7500, type: 'drone' }, { at: 7700, type: 'drone' }, { at: 7900, type: 'drone' },
    { at: 11500, type: 'striker' }, { at: 11700, type: 'striker' }
  ]},
  // W4 — vespid pressure.
  { spawns: [
    { at:   500, type: 'vespid' },
    { at:  3500, type: 'striker' }, { at: 3700, type: 'striker' },
    { at:  7000, type: 'vespid' },
    { at: 10500, type: 'drone' }, { at: 10700, type: 'drone' },
    { at: 10900, type: 'drone' }, { at: 11100, type: 'drone' },
    { at: 14500, type: 'vespid' }
  ]},
  // W5 — full swarm before the queen.
  { spawns: [
    { at:   500, type: 'vespid' }, { at: 700, type: 'vespid' },
    { at:  4500, type: 'striker' }, { at: 4700, type: 'striker' }, { at: 4900, type: 'striker' },
    { at:  8500, type: 'drone' }, { at: 8700, type: 'drone' }, { at: 8900, type: 'drone' },
    { at:  9100, type: 'drone' }, { at: 9300, type: 'drone' },
    { at: 13500, type: 'vespid' }, { at: 13700, type: 'vespid' }
  ]},
  // W6 — THE DARK QUEEN. A long, brutal encounter.
  { spawns: [
    { at:   500, type: 'striker' }, { at: 700, type: 'striker' }, { at: 900, type: 'striker' },
    { at:  4500, type: 'vespid' }, { at: 4700, type: 'vespid' },
    { at:  8500, type: 'darkQueen' },
    { at: 13500, type: 'drone' }, { at: 13600, type: 'drone' }, { at: 13700, type: 'drone' },
    { at: 13800, type: 'drone' }, { at: 13900, type: 'drone' }, { at: 14000, type: 'drone' },
    { at: 18000, type: 'vespid' }, { at: 18200, type: 'vespid' }, { at: 18400, type: 'vespid' },
    { at: 22500, type: 'striker' }, { at: 22500, type: 'striker' }, { at: 22500, type: 'striker' },
    { at: 26500, type: 'vespid' }, { at: 26700, type: 'vespid' }
  ]}
];

// --- Late-game maps -------------------------------------------------------

const FOREST = [
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2500, type: 'cub' }, { at: 4500, type: 'cub' },
    { at: 7500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2000, type: 'cub' }, { at: 3500, type: 'cub' },
    { at: 6500, type: 'brown' }, { at: 9500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 3500, type: 'honeybadger' },
    { at: 7000, type: 'brown' }, { at: 10500, type: 'cub' }, { at: 10700, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 500, type: 'brown' },
    { at: 4500, type: 'honeybadger' },
    { at: 8000, type: 'cub' }, { at: 8200, type: 'cub' }, { at: 8400, type: 'cub' },
    { at: 12000, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' },
    { at: 4500, type: 'brown' }, { at: 4500, type: 'brown' },
    { at: 8500, type: 'honeybadger' }, { at: 8700, type: 'honeybadger' },
    { at: 12500, type: 'cub' }, { at: 12700, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 3500, type: 'grizzly' },
    { at: 7000, type: 'honeybadger' }, { at: 7200, type: 'honeybadger' },
    { at: 10500, type: 'brown' }, { at: 10700, type: 'brown' }, { at: 10900, type: 'brown' }
  ]}
];

const MOUNTAIN = [
  { spawns: [
    { at: 500, type: 'brown' }, { at: 4500, type: 'brown' }, { at: 8500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 4000, type: 'grizzly' }, { at: 8500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 500, type: 'brown' },
    { at: 4500, type: 'grizzly' }, { at: 9500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'grizzly' },
    { at: 8500, type: 'cub' }, { at: 8700, type: 'cub' }, { at: 8900, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 3500, type: 'grizzly' }, { at: 6500, type: 'grizzly' },
    { at: 10500, type: 'brown' }, { at: 10700, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' }, { at: 900, type: 'grizzly' },
    { at: 6500, type: 'honeybadger' }, { at: 6700, type: 'honeybadger' },
    { at: 10500, type: 'brown' }, { at: 10500, type: 'brown' }, { at: 10500, type: 'brown' }
  ]}
];

const VOLCANO = [
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2500, type: 'brown' }, { at: 6500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 4000, type: 'grizzly' }, { at: 8500, type: 'cub' }, { at: 8700, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'honeybadger' },
    { at: 8500, type: 'brown' }, { at: 8700, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 500, type: 'grizzly' },
    { at: 5500, type: 'honeybadger' }, { at: 5700, type: 'honeybadger' },
    { at: 10500, type: 'cub' }, { at: 10700, type: 'cub' }, { at: 10900, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 3500, type: 'grizzly' }, { at: 6500, type: 'grizzly' },
    { at: 9500, type: 'honeybadger' }, { at: 9700, type: 'honeybadger' }, { at: 9900, type: 'honeybadger' }
  ]},
  // BOSS: Lava Bear.
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at: 4500, type: 'honeybadger' }, { at: 4700, type: 'honeybadger' },
    { at: 8500, type: 'lavaBear' },
    { at: 14500, type: 'brown' }, { at: 14700, type: 'brown' }, { at: 14900, type: 'brown' },
    { at: 18500, type: 'grizzly' }
  ]}
];

const SWAMP = [
  { spawns: [
    { at: 500, type: 'brown' }, { at: 3500, type: 'brown' }, { at: 7500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 5500, type: 'grizzly' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 3500, type: 'panda' }, { at: 7500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 3000, type: 'panda' }, { at: 5500, type: 'panda' },
    { at: 8500, type: 'cub' }, { at: 8700, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'grizzly' },
    { at: 8500, type: 'panda' }, { at: 8700, type: 'panda' }, { at: 8900, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' }, { at: 900, type: 'grizzly' },
    { at: 6500, type: 'panda' }, { at: 6700, type: 'panda' }, { at: 6900, type: 'panda' }, { at: 7100, type: 'panda' },
    { at: 12500, type: 'grizzly' }
  ]}
];

const TUNDRA = [
  { spawns: [
    { at: 500, type: 'panda' }, { at: 3500, type: 'panda' }, { at: 7500, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 500, type: 'panda' },
    { at: 5500, type: 'panda' }, { at: 5700, type: 'panda' }, { at: 9500, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 700, type: 'panda' }, { at: 3500, type: 'grizzly' },
    { at: 7500, type: 'panda' }, { at: 7700, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 700, type: 'panda' }, { at: 900, type: 'panda' },
    { at: 4500, type: 'grizzly' }, { at: 4700, type: 'grizzly' },
    { at: 9500, type: 'panda' }, { at: 9700, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 700, type: 'panda' }, { at: 900, type: 'panda' }, { at: 1100, type: 'panda' },
    { at: 5500, type: 'panda' }, { at: 5700, type: 'panda' }, { at: 5900, type: 'panda' },
    { at: 10500, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at: 4500, type: 'panda' }, { at: 4700, type: 'panda' }, { at: 4900, type: 'panda' },
    { at: 5100, type: 'panda' }, { at: 5300, type: 'panda' },
    { at: 10500, type: 'panda' }, { at: 10700, type: 'panda' }, { at: 10900, type: 'panda' }
  ]}
];

const STORM = [
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2500, type: 'cub' }, { at: 4500, type: 'brown' }, { at: 8500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'honeybadger' }, { at: 4500, type: 'honeybadger' },
    { at: 8500, type: 'brown' }, { at: 10500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'grizzly' }, { at: 9500, type: 'honeybadger' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 500, type: 'grizzly' },
    { at: 5500, type: 'honeybadger' }, { at: 5700, type: 'honeybadger' },
    { at: 10500, type: 'brown' }, { at: 10500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 3500, type: 'grizzly' }, { at: 6500, type: 'grizzly' },
    { at: 9500, type: 'honeybadger' }, { at: 9700, type: 'honeybadger' }, { at: 9900, type: 'honeybadger' }
  ]},
  // BOSS: Thunder Lord.
  { spawns: [
    { at: 500, type: 'honeybadger' }, { at: 700, type: 'honeybadger' }, { at: 900, type: 'honeybadger' },
    { at: 4500, type: 'grizzly' }, { at: 4700, type: 'grizzly' },
    { at: 8500, type: 'thunderLord' },
    { at: 14000, type: 'cub' }, { at: 14100, type: 'cub' }, { at: 14200, type: 'cub' },
    { at: 14300, type: 'cub' }, { at: 14400, type: 'cub' },
    { at: 18500, type: 'grizzly' }, { at: 18700, type: 'grizzly' }
  ]}
];

const DESERT = [
  { spawns: [
    { at: 500, type: 'cub' }, { at: 1500, type: 'cub' }, { at: 3500, type: 'cub' }, { at: 5500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2000, type: 'cub' },
    { at: 4500, type: 'brown' }, { at: 8500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 3500, type: 'brown' }, { at: 7500, type: 'grizzly' }
  ]},
  { spawns: [
    { at: 500, type: 'brown' }, { at: 500, type: 'brown' }, { at: 500, type: 'brown' },
    { at: 6500, type: 'honeybadger' }, { at: 10500, type: 'brown' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'grizzly' },
    { at: 8500, type: 'cub' }, { at: 8700, type: 'cub' }, { at: 8900, type: 'cub' }, { at: 9100, type: 'cub' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' }, { at: 900, type: 'grizzly' },
    { at: 6500, type: 'brown' }, { at: 6700, type: 'brown' }, { at: 6900, type: 'brown' }, { at: 7100, type: 'brown' },
    { at: 11500, type: 'honeybadger' }, { at: 11700, type: 'honeybadger' }
  ]}
];

const SKY = [
  { spawns: [
    { at: 500, type: 'drone' }, { at: 2500, type: 'drone' }, { at: 4500, type: 'drone' }, { at: 7500, type: 'drone' }
  ]},
  { spawns: [
    { at: 500, type: 'drone' }, { at: 700, type: 'drone' },
    { at: 4500, type: 'striker' }, { at: 7500, type: 'striker' }
  ]},
  { spawns: [
    { at: 500, type: 'striker' }, { at: 3500, type: 'striker' },
    { at: 7500, type: 'vespid' }, { at: 11500, type: 'drone' }, { at: 11700, type: 'drone' }
  ]},
  { spawns: [
    { at: 500, type: 'vespid' }, { at: 4500, type: 'vespid' },
    { at: 8500, type: 'drone' }, { at: 8700, type: 'drone' }, { at: 8900, type: 'drone' }, { at: 9100, type: 'drone' }
  ]},
  { spawns: [
    { at: 500, type: 'vespid' }, { at: 3500, type: 'vespid' }, { at: 6500, type: 'vespid' },
    { at: 10500, type: 'striker' }, { at: 10700, type: 'striker' }, { at: 10900, type: 'striker' }
  ]},
  { spawns: [
    { at: 500, type: 'vespid' }, { at: 700, type: 'vespid' }, { at: 900, type: 'vespid' }, { at: 1100, type: 'vespid' },
    { at: 6500, type: 'drone' }, { at: 6600, type: 'drone' }, { at: 6700, type: 'drone' },
    { at: 6800, type: 'drone' }, { at: 6900, type: 'drone' }, { at: 7000, type: 'drone' },
    { at: 11500, type: 'striker' }, { at: 11700, type: 'striker' }, { at: 11900, type: 'striker' }
  ]}
];

const COSMOS = [
  { spawns: [
    { at: 500, type: 'cub' }, { at: 2500, type: 'drone' },
    { at: 5500, type: 'brown' }, { at: 8500, type: 'striker' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 4500, type: 'vespid' },
    { at: 8500, type: 'brown' }, { at: 11500, type: 'panda' }
  ]},
  { spawns: [
    { at: 500, type: 'panda' }, { at: 500, type: 'panda' },
    { at: 5500, type: 'vespid' }, { at: 5700, type: 'vespid' },
    { at: 10500, type: 'grizzly' }, { at: 12500, type: 'grizzly' }
  ]},
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' },
    { at: 5500, type: 'boss' },
    { at: 11500, type: 'striker' }, { at: 11700, type: 'striker' }, { at: 11900, type: 'striker' }
  ]},
  { spawns: [
    { at: 500, type: 'vespid' }, { at: 700, type: 'vespid' }, { at: 900, type: 'vespid' },
    { at: 6500, type: 'darkQueen' },
    { at: 14500, type: 'grizzly' }, { at: 14700, type: 'grizzly' }, { at: 14900, type: 'grizzly' }
  ]},
  // FINAL BOSS: The Eternal Bear.
  { spawns: [
    { at: 500, type: 'grizzly' }, { at: 700, type: 'grizzly' }, { at: 900, type: 'grizzly' },
    { at: 4500, type: 'vespid' }, { at: 4700, type: 'vespid' }, { at: 4900, type: 'vespid' },
    { at: 8500, type: 'darkQueen' },
    { at: 15500, type: 'eternalBear' },
    { at: 22500, type: 'drone' }, { at: 22600, type: 'drone' }, { at: 22700, type: 'drone' },
    { at: 22800, type: 'drone' }, { at: 22900, type: 'drone' }, { at: 23000, type: 'drone' },
    { at: 27500, type: 'grizzly' }, { at: 27700, type: 'grizzly' },
    { at: 31500, type: 'vespid' }, { at: 31700, type: 'vespid' }, { at: 31900, type: 'vespid' }
  ]}
];

export const WAVES_BY_MAP = {
  garden: GARDEN,
  playground: PLAYGROUND,
  sandpit: SANDPIT,
  cave: CAVE,
  ice: ICE,
  hive: HIVE,
  forest: FOREST,
  mountain: MOUNTAIN,
  volcano: VOLCANO,
  swamp: SWAMP,
  tundra: TUNDRA,
  storm: STORM,
  desert: DESERT,
  sky: SKY,
  cosmos: COSMOS
};
