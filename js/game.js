import { RANKS, TOOLS, SKILLS } from './data.js';
import { bootSequence, log } from './terminal.js';

// ── STATE ─────────────────────────────────────────────────
export const state = {
  xp: 0,
  credits: 100,
  rank: 0,
  inventory: ['nmap'],
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
    log(`[RANK UP] ★ Nouveau rang : ${name} !`, 'success', false);
    state.credits += 200;
    log(`[BONUS] +200 crédits pour votre promotion !`, 'success', false);
  }
}

// ── PERSISTENCE ───────────────────────────────────────────
export function saveState() {
  localStorage.setItem('root-access-v1', JSON.stringify(state));
  // Refresh UI on every save
  _refreshUI();
}

function loadState() {
  const raw = localStorage.getItem('root-access-v1');
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
  } catch {
    localStorage.removeItem('root-access-v1');
  }
}

// ── ENTRY POINT ───────────────────────────────────────────
async function init() {
  loadState();

  const { renderAll, renderMissionList } = await import('./ui.js');
  const { setupWindowHandlers } = await import('./missions.js');

  // Wire global refresh so saveState can call UI
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
