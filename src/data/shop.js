// Shop offerings. Skins are one-time purchases; wipes are stackable
// consumables used mid-run (W key wipes all non-boss enemies).

export const SHOP_ITEMS = {
  wipe: {
    id: 'wipe', name: 'Wipe', cost: 10,
    kind: 'consumable',
    icon: '💨', tint: 0xa8d8ff,
    desc: 'Clears every non-boss enemy. Press W in-game.'
  },
  goldHive: {
    id: 'goldHive', name: 'Gold Hive', cost: 10,
    kind: 'hiveSkin', tint: 0xffd24a,
    icon: '🏠', desc: 'Your hive shimmers in gold.'
  },
  crystalHive: {
    id: 'crystalHive', name: 'Crystal Hive', cost: 20,
    kind: 'hiveSkin', tint: 0x88c0ff,
    icon: '🏠', desc: 'Pale blue crystal hive.'
  },
  royalHive: {
    id: 'royalHive', name: 'Royal Hive', cost: 30,
    kind: 'hiveSkin', tint: 0xa860ff,
    icon: '🏠', desc: 'Royal purple — the queen approves.'
  }
};

export const SHOP_ORDER = ['wipe', 'goldHive', 'crystalHive', 'royalHive'];
