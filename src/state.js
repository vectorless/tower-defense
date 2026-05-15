// All progression state lives on scene.registry. Mutators here are the only
// callers of registry.set, so individual scenes never have to think about
// invariants like hiveHp clamping or flipping gameOver.

import { WORLD } from './data/world.js';
import { MAPS } from './data/maps.js';

// Fresh-campaign init. Called once from main.js and on Menu→Start.
export function initState(registry) {
  // Campaign progress.
  registry.set('currentMapId', 'garden');
  registry.set('unlockedBees', MAPS.garden.startingBees.slice());
  registry.set('lastUnlocked', []);           // shown on MapClearScene

  // Persistent meta (coins, inventory, skins) — kept across maps.
  registry.set('coins', 0);
  registry.set('wipes', 0);
  registry.set('ownedSkins', []);
  registry.set('activeHiveSkin', null);

  // Per-map play state.
  registry.set('honey', WORLD.startingHoney);
  registry.set('hiveHp', WORLD.hiveHp);
  registry.set('waveIndex', 0);                 // 0..N-1 within current map
  registry.set('wavePhase', 'prepare');         // 'prepare' | 'spawning' | 'cleanup'
  registry.set('wavePhaseElapsedMs', 0);
  registry.set('selectedBeeType', null);
  registry.set('gameOver', false);
  registry.set('victory', false);               // becomes true when current map cleared
  registry.set('campaignWon', false);           // true after sandpit cleared
}

// Full reset to the start of the campaign. Called from Menu→Start.
export function resetState(registry) {
  initState(registry);
}

// Reset only per-map state (honey, hive, waves, flags). Keeps currentMapId
// and unlockedBees so the player retries the same map / advances correctly.
export function resetForMap(registry) {
  registry.set('honey', WORLD.startingHoney);
  registry.set('hiveHp', WORLD.hiveHp);
  registry.set('waveIndex', 0);
  registry.set('wavePhase', 'prepare');
  registry.set('wavePhaseElapsedMs', 0);
  registry.set('selectedBeeType', null);
  registry.set('gameOver', false);
  registry.set('victory', false);
}

// Set the current map and reset unlockedBees to that map's starting set.
export function setCurrentMap(registry, mapId) {
  const map = MAPS[mapId];
  if (!map) return;
  registry.set('currentMapId', mapId);
  registry.set('unlockedBees', map.startingBees.slice());
}

// Called when the current map is cleared. Stores `lastUnlocked` for the
// MapClearScene, then advances `currentMapId` to the next map (if any).
// Returns the next map id, or null if the campaign is complete.
export function advanceMap(registry) {
  const cur = registry.get('currentMapId');
  const map = MAPS[cur];
  if (!map) return null;
  registry.set('previousMapId', cur);
  registry.set('lastUnlocked', (map.unlocksAtEnd ?? []).slice());
  if (map.next) {
    setCurrentMap(registry, map.next);
    return map.next;
  }
  registry.set('campaignWon', true);
  return null;
}

// --- Honey ---------------------------------------------------------------

export function addHoney(registry, amount) {
  const next = Math.max(0, (registry.get('honey') ?? 0) + amount);
  registry.set('honey', next);
  return next;
}

export function spendHoney(registry, amount) {
  const cur = registry.get('honey') ?? 0;
  if (cur < amount) return false;
  registry.set('honey', cur - amount);
  return true;
}

// --- Hive ----------------------------------------------------------------

export function damageHive(registry, amount) {
  const next = Math.max(0, (registry.get('hiveHp') ?? 0) - amount);
  registry.set('hiveHp', next);
  if (next === 0 && !registry.get('gameOver')) {
    registry.set('gameOver', true);
  }
  return next;
}

// --- Wave ----------------------------------------------------------------

export function setWaveIndex(registry, n) {
  registry.set('waveIndex', n);
}

export function setWavePhase(registry, phase, elapsedMs = 0) {
  registry.set('wavePhase', phase);
  registry.set('wavePhaseElapsedMs', elapsedMs);
}

export function tickWavePhase(registry, deltaMs) {
  registry.set('wavePhaseElapsedMs', (registry.get('wavePhaseElapsedMs') ?? 0) + deltaMs);
}

// --- Selection (placement palette) --------------------------------------

export function setSelectedBee(registry, type) {
  registry.set('selectedBeeType', type ?? null);
}

// --- Coins / shop --------------------------------------------------------

export function addCoins(registry, n) {
  const next = Math.max(0, (registry.get('coins') ?? 0) + n);
  registry.set('coins', next);
  return next;
}

export function spendCoins(registry, n) {
  const cur = registry.get('coins') ?? 0;
  if (cur < n) return false;
  registry.set('coins', cur - n);
  return true;
}

export function addWipe(registry, n = 1) {
  registry.set('wipes', (registry.get('wipes') ?? 0) + n);
}

export function useWipe(registry) {
  const cur = registry.get('wipes') ?? 0;
  if (cur <= 0) return false;
  registry.set('wipes', cur - 1);
  return true;
}

export function ownSkin(registry, id) {
  const owned = registry.get('ownedSkins') ?? [];
  if (owned.includes(id)) return;
  registry.set('ownedSkins', [...owned, id]);
}

export function setActiveHiveSkin(registry, id) {
  registry.set('activeHiveSkin', id);
}

// --- End-of-run ----------------------------------------------------------

export function winRun(registry) {
  registry.set('victory', true);
}

export function loseRun(registry) {
  registry.set('gameOver', true);
}
