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
    startingBees: [
      'worker', 'honeypot', 'soldier', 'bomber',
      'sniper', 'queen', 'hornet', 'stingerLord',
      'bumblebee', 'wasp', 'mortar'
    ],
    unlocksAtEnd: [],
    next: null
  }
};

export const MAP_ORDER = ['garden', 'playground', 'sandpit', 'cave', 'ice', 'hive'];
