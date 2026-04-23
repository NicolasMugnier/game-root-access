import { RANKS, TOOLS, SKILLS } from './data.js';
import { bootSequence, log } from './terminal.js';

// ── STATE ─────────────────────────────────────────────────
export const state = {
  xp: 0,
  credits: 100,
  rank: 0,
  inventory: [],
  toolLevels: {},
  skills: {},
  completedMissions: [],
  currentMission: null,
  knowledgeJournal: [],
};

// ── MUTATIONS ─────────────────────────────────────────────
export function gainXP(amount) {
  state.xp += amount;
  _checkRankUp();
  saveState();
}

export function gainCredits(amount) {
  state.credits += amount;
  saveState();
}

export function spendCredits(amount) {
  if (state.credits < amount) return false;
  state.credits -= amount;
  saveState();
  return true;
}

function _checkRankUp() {
  const newRank = RANKS.filter(r => state.xp >= r.minXP).length - 1;
  if (newRank > state.rank) {
    state.rank = newRank;
    const name = RANKS[newRank].name;
    log(`[RANK UP] ★ Nouveau rang : ${name} !`, 'success');
    state.credits += 200;
    log(`[BONUS] +200 crédits pour votre promotion !`, 'success');
  }
}

// ── PERSISTENCE ───────────────────────────────────────────
export function saveState() {
  localStorage.setItem('root-access-v1', JSON.stringify(state));
  _refreshUI();
}

function loadState() {
  const raw = localStorage.getItem('root-access-v1');
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    // Merge to preserve new keys added after first save
    Object.assign(state, saved);
    if (!state.toolLevels) state.toolLevels = { nmap: 1 };
  } catch {
    localStorage.removeItem('root-access-v1');
  }
}

// ── ENTRY POINT ───────────────────────────────────────────
async function init() {
  loadState();

  const { renderAll } = await import('./ui.js');
  const { setupWindowHandlers } = await import('./missions.js');

  window.__renderAll = renderAll;

  setupWindowHandlers();
  renderAll();

  await bootSequence();
  log('[GAME] Système prêt. Sélectionnez une mission.', 'success');
}

function _refreshUI() {
  if (window.__renderAll) window.__renderAll();
}

init();
