import { state, gainXP, gainCredits, spendCredits, saveState } from './game.js';
import { MISSIONS, TOOLS, SKILLS } from './data.js';
import { log } from './terminal.js';
import { renderMission, renderMissionList, showTooltip, renderJournal, renderAll } from './ui.js';

// ── MISSION FLOW ──────────────────────────────────────────
function startMission(id) {
  const mission = MISSIONS.find(m => m.id === id);
  if (!mission) return;
  state.currentMission = id;
  window._sel = null;
  log(`[MISSION] Chargement : "${mission.title}"`, 'warn');
  log(`[MISSION] Type : ${mission.type.toUpperCase()} | Difficulté : ${'★'.repeat(mission.difficulty)}`, 'info');
  renderMission(mission);
}

function submitMission() {
  const id = state.currentMission;
  if (!id) { log('[WARN] Aucune mission active', 'warn'); return; }

  const mission = MISSIONS.find(m => m.id === id);
  if (!mission) return;

  let success = false;

  if (mission.type === 'phishing') {
    const selected = Array.from(
      document.querySelectorAll('.flag-item.selected input')
    ).map(el => el.value);

    if (selected.length === 0) {
      log('[WARN] Sélectionnez au moins un red flag', 'warn');
      return;
    }

    const correct = mission.options.filter(o => o.correct).map(o => o.id);
    const truePos  = selected.filter(id => correct.includes(id)).length;
    const falsePos = selected.filter(id => !correct.includes(id)).length;
    success = truePos === correct.length && falsePos === 0;

  } else if (mission.type === 'hash' || mission.type === 'network' || mission.type === 'ctf') {
    if (!window._sel) {
      log('[WARN] Sélectionnez une option avant de valider', 'warn');
      return;
    }

    if (mission.type === 'hash') {
      const opt = mission.options.find(o => o.id === window._sel);
      success = opt ? opt.correct : false;
    } else if (mission.type === 'network') {
      success = window._sel === mission.correctNodeId;
    } else if (mission.type === 'ctf') {
      const opt = mission.options.find(o => o.id === window._sel);
      success = opt ? opt.correct : false;
    }
  }

  _resolve(mission, success);
  window._sel = null;
}

function _resolve(mission, success) {
  if (success) {
    gainXP(mission.xpReward);
    gainCredits(mission.creditReward);
    state.completedMissions.push(mission.id);
    state.currentMission = null;

    state.knowledgeJournal.push({
      title: mission.title,
      content: mission.tooltip.knowledge,
    });

    log(`[SUCCESS] "${mission.title}" réussie ! +${mission.xpReward} XP +${mission.creditReward}₿`, 'success');
    saveState();
    showTooltip(true, mission, mission.xpReward, mission.creditReward);
  } else {
    log(`[FAIL] Mission "${mission.title}" échouée. Relancez pour réessayer.`, 'error');
    showTooltip(false, mission, 0, 0);
  }
}

// ── SHOP & SKILLS ─────────────────────────────────────────
function buyTool(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool || state.inventory.includes(toolId)) return;
  if (!spendCredits(tool.cost)) {
    log(`[SHOP] Crédits insuffisants pour ${tool.name}`, 'error');
    return;
  }
  state.inventory.push(toolId);
  log(`[SHOP] ${tool.icon} ${tool.name} acquis ! ${tool.passive}`, 'success');
  saveState();
}

function unlockSkill(skillId, cost) {
  if (state.skills[skillId]) return;

  let skillName = skillId;
  for (const branch of Object.values(SKILLS)) {
    const node = branch.nodes.find(n => n.id === skillId);
    if (node) { skillName = node.name; break; }
  }

  if (!spendCredits(cost)) {
    log(`[SKILL] Crédits insuffisants pour "${skillName}"`, 'error');
    return;
  }
  state.skills[skillId] = true;
  log(`[SKILL] Compétence débloquée : "${skillName}" !`, 'success');
  saveState();
}

// ── WINDOW HANDLERS ───────────────────────────────────────
export function setupWindowHandlers() {
  window._startMission = startMission;
  window._backToList   = () => { state.currentMission = null; renderMissionList(); };
  window._submitMission = submitMission;

  window._selectSingle = (el, selector) => {
    document.querySelectorAll(selector).forEach(n => n.classList.remove('selected'));
    el.classList.add('selected');
  };

  window._closeTooltip = (goToList) => {
    document.getElementById('tooltip-overlay').classList.add('hidden');
    if (goToList) {
      renderMissionList();
      renderAll();
    }
  };

  window._viewJournal  = () => renderJournal();
  window._closeJournal = () => document.getElementById('journal-panel').classList.add('hidden');

  window._buyTool    = buyTool;
  window._unlockSkill = unlockSkill;

  window._resetGame = () => {
    if (!confirm('Réinitialiser la partie ? Toute la progression sera perdue.')) return;
    localStorage.removeItem('root-access-v1');
    location.reload();
  };
}
