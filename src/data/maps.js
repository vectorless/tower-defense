// Map definitions: visual theme, row count, starting bee unlocks, what's
// unlocked at the end (shown on MapClearScene), and the next map.

export const MAPS = {
  garden: {
    id: 'garden',
    name: 'The Garden',
    flavor: 'Cubs and brown bears have spotted your hive.',
    rows: 5,
    grassA: 0x3a5a28, grassB: 0x466a30,
    spawnTile: 0x2e3a1c, hiveTile: 0x3a2a14,
    bgColor: '#1a2a10',
    accentColor: 0x66cc44,
    startingBees: ['worker', 'honeypot'],
    unlocksAtEnd: ['soldier', 'bomber'],
    next: 'playground'
  },
  playground: {
    id: 'playground',
    name: 'The Playground',
    flavor: 'Bigger bears stomp across the concrete.',
    rows: 5,
    grassA: 0x6b6b73, grassB: 0x80808a,
    spawnTile: 0x4a4a52, hiveTile: 0x3a3a40,
    bgColor: '#1a1a22',
    accentColor: 0xff70a0,
    startingBees: ['worker', 'honeypot', 'soldier', 'bomber'],
    unlocksAtEnd: ['sniper', 'queen'],
    next: 'sandpit'
  },
  sandpit: {
    id: 'sandpit',
    name: 'The Sandpit',
    flavor: 'The bear lord himself comes for your honey.',
    rows: 5,
    grassA: 0xd8b070, grassB: 0xc89860,
    spawnTile: 0x9a7848, hiveTile: 0x7a5830,
    bgColor: '#3a2a14',
    accentColor: 0xffaa30,
    startingBees: ['worker', 'honeypot', 'soldier', 'bomber', 'sniper', 'queen'],
    unlocksAtEnd: ['hornet', 'stingerLord'],
    next: 'cave'
  },
  cave: {
    id: 'cave',
    name: 'The Cave',
    flavor: 'Deeper still — and the bears here do not flinch.',
    rows: 5,
    grassA: 0x222230, grassB: 0x2c2c3a,
    spawnTile: 0x101018, hiveTile: 0x1a1410,
    bgColor: '#08080e',
    accentColor: 0x66ccff,
    startingBees: [
      'worker', 'honeypot', 'soldier', 'bomber',
      'sniper', 'queen', 'hornet', 'stingerLord'
    ],
    unlocksAtEnd: ['bumblebee', 'wasp', 'mortar'],
    next: 'ice'
  },
  ice: {
    id: 'ice',
    name: 'The Ice',
    flavor: 'Pandas. Slow, tough, and they never stop coming.',
    rows: 5,
    grassA: 0xbcd8f0, grassB: 0xa8c8e8,
    spawnTile: 0x7898b8, hiveTile: 0x405870,
    bgColor: '#0a1828',
    accentColor: 0xaad8ff,
    startingBees: [
      'worker', 'honeypot', 'soldier', 'bomber',
      'sniper', 'queen', 'hornet', 'stingerLord',
      'bumblebee', 'wasp', 'mortar'
    ],
    unlocksAtEnd: [],
    next: 'hive'
  },
  hive: {
    id: 'hive',
    name: 'The Hive',
    flavor: 'A rival hive. Evil bees serve the Dark Queen.',
    rows: 5,
    tileShape: 'hex',
    grassA: 0xffc24a, grassB: 0xffae30,
    spawnTile: 0x8a5a1f, hiveTile: 0x6b3a0f,
    bgColor: '#3a1d0d',
    accentColor: 0xff4444,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [],
    next: 'forest'
  },
  forest: {
    id: 'forest', name: 'The Forest',
    flavor: 'Deep woods. The bears know every shortcut.',
    rows: 5,
    grassA: 0x2a4a18, grassB: 0x356228,
    spawnTile: 0x1a3010, hiveTile: 0x3a280f,
    bgColor: '#0a1505',
    accentColor: 0x66cc44,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'mountain'
  },
  mountain: {
    id: 'mountain', name: 'The Mountain',
    flavor: 'Thin air. Stone-hearted bears.',
    rows: 5,
    grassA: 0x808088, grassB: 0x909098,
    spawnTile: 0x606068, hiveTile: 0x404048,
    bgColor: '#181820',
    accentColor: 0xccccdd,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'volcano'
  },
  volcano: {
    id: 'volcano', name: 'The Volcano',
    flavor: 'And from the smoke, a Lava Bear emerges.',
    rows: 5,
    grassA: 0x4a1010, grassB: 0x6a1818,
    spawnTile: 0x2a0808, hiveTile: 0x300404,
    bgColor: '#1a0404',
    accentColor: 0xff4400,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'swamp'
  },
  swamp: {
    id: 'swamp', name: 'The Swamp',
    flavor: 'Sluggish, soaked, and very, very angry.',
    rows: 5,
    grassA: 0x3a5a28, grassB: 0x466228,
    spawnTile: 0x223010, hiveTile: 0x2a2010,
    bgColor: '#0a1408',
    accentColor: 0x88aa44,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'tundra'
  },
  tundra: {
    id: 'tundra', name: 'The Tundra',
    flavor: 'Endless white. Endless pandas.',
    rows: 5,
    grassA: 0x90a8b8, grassB: 0xa0b8c8,
    spawnTile: 0x607080, hiveTile: 0x405060,
    bgColor: '#1a2030',
    accentColor: 0xaaccff,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'storm'
  },
  storm: {
    id: 'storm', name: 'The Storm',
    flavor: 'Lightning over the field. Then the Thunder Lord arrives.',
    rows: 5,
    grassA: 0x404060, grassB: 0x505070,
    spawnTile: 0x282840, hiveTile: 0x181828,
    bgColor: '#08081a',
    accentColor: 0xc0c0ff,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'desert'
  },
  desert: {
    id: 'desert', name: 'The Desert',
    flavor: 'Cracked clay. No water. Plenty of bears.',
    rows: 5,
    grassA: 0xc88858, grassB: 0xd89868,
    spawnTile: 0x8a6840, hiveTile: 0x6a4828,
    bgColor: '#2a1808',
    accentColor: 0xffaa44,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'sky'
  },
  sky: {
    id: 'sky', name: 'The Sky',
    flavor: 'Above the clouds. The evil bees followed.',
    rows: 5,
    grassA: 0xb8d4e8, grassB: 0xcce0f0,
    spawnTile: 0x90b0d0, hiveTile: 0x6890b0,
    bgColor: '#5080b8',
    accentColor: 0xffffff,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: 'cosmos'
  },
  cosmos: {
    id: 'cosmos', name: 'The Cosmos',
    flavor: 'The Eternal Bear waits at the end of everything.',
    rows: 5,
    tileShape: 'hex',
    grassA: 0x18182a, grassB: 0x252535,
    spawnTile: 0x0a0a18, hiveTile: 0x000010,
    bgColor: '#000005',
    accentColor: 0xffff80,
    startingBees: ALL_BEES(),
    unlocksAtEnd: [], next: null
  }
};

// All player bees — every late-game map starts with the full roster.
function ALL_BEES() {
  return [
    'worker', 'honeypot', 'soldier', 'bomber',
    'sniper', 'queen', 'hornet', 'stingerLord',
    'bumblebee', 'wasp', 'mortar'
  ];
}

export const MAP_ORDER = [
  'garden', 'playground', 'sandpit', 'cave', 'ice', 'hive',
  'forest', 'mountain', 'volcano', 'swamp', 'tundra', 'storm',
  'desert', 'sky', 'cosmos'
];
