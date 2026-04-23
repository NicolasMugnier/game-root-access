import { state } from './game.js';
import { RANKS, TOOLS, SKILLS, MISSIONS } from './data.js';

// ── HEADER ────────────────────────────────────────────────
function renderHeader() {
  const rank = RANKS[state.rank];
  const next = RANKS[state.rank + 1];

  document.getElementById('rank-display').textContent = rank.name;
  document.getElementById('credits-display').textContent = `₿ ${state.credits}`;

  const pct = next
    ? ((state.xp - rank.minXP) / (next.minXP - rank.minXP)) * 100
    : 100;
  document.getElementById('xp-fill').style.width = `${Math.min(100, pct)}%`;
  document.getElementById('xp-label').textContent = next
    ? `${state.xp} / ${next.minXP} XP`
    : `${state.xp} XP — MAX`;
}

// ── FOOTER ────────────────────────────────────────────────
function renderFooter() {
  const actEl = document.getElementById('action-buttons');
  actEl.innerHTML = `
    <button class="btn" onclick="window._backToList()">📋 Missions</button>`;

  const netEl = document.getElementById('mini-network');
  const done = state.completedMissions.length;
  netEl.innerHTML = `
    <span>NET:</span>
    <div class="mn-node on" title="Vous"></div>
    <div class="mn-edge"></div>
    <div class="mn-node ${done > 0 ? 'hit' : ''}" title="Cible 1"></div>
    <div class="mn-edge"></div>
    <div class="mn-node ${done > 1 ? 'hit' : ''}" title="Cible 2"></div>
    <div class="mn-edge"></div>
    <div class="mn-node" title="Cible 3"></div>
    <span style="margin-left:6px">${done} compromis</span>`;
}

// ── INVENTORY ─────────────────────────────────────────────
function renderInventory() {
  const el = document.getElementById('tools-inventory');
  const owned = TOOLS.filter(t => state.inventory.includes(t.id));
  const shop  = TOOLS.filter(t => !state.inventory.includes(t.id));

  let html = `<div class="panel-title">Outils (${owned.length}/${TOOLS.length})</div>`;

  for (const t of owned) {
    const stars = '★'.repeat(t.level) + '☆'.repeat(t.maxLevel - t.level);
    html += `
      <div class="tool-card">
        <div class="tool-card-head">
          <span class="tool-name">${t.icon} ${t.name}</span>
          <span class="tool-level">Nv.${t.level}</span>
        </div>
        <div class="tool-stars">${stars}</div>
        <div class="tool-bonus">${t.passive}</div>
      </div>`;
  }

  if (shop.length) {
    html += `<div class="panel-title shop-section">Boutique</div>`;
    for (const t of shop) {
      const canBuy = state.credits >= t.cost;
      html += `
        <div class="tool-card" style="opacity:${canBuy ? '1' : '0.55'}">
          <div class="tool-card-head">
            <span class="tool-name">${t.icon} ${t.name}</span>
            <span class="tool-price">${t.cost}₿</span>
          </div>
          <div class="tool-bonus">${t.passive}</div>
          <button class="btn amber" style="margin-top:6px;padding:4px 10px;font-size:10px"
            onclick="window._buyTool('${t.id}')" ${canBuy ? '' : 'disabled'}>
            Acheter
          </button>
        </div>`;
    }
  }

  el.innerHTML = html;
}

// ── SKILL TREE ────────────────────────────────────────────
function renderSkillTree() {
  const el = document.getElementById('skill-tree');
  let html = `<div class="panel-title" style="margin-top:14px">Skill Tree</div>`;

  for (const [key, branch] of Object.entries(SKILLS)) {
    html += `
      <div class="skill-branch">
        <div class="branch-name" style="color:${branch.color}">${branch.name}</div>`;
    for (const node of branch.nodes) {
      const done   = !!state.skills[node.id];
      const reqOk  = !node.requires || !!state.skills[node.requires];
      const cls    = done ? 'unlocked' : (!reqOk ? 'locked' : '');
      const action = (!done && reqOk)
        ? `onclick="window._unlockSkill('${node.id}',${node.cost})"`
        : '';
      html += `
        <div class="skill-node ${cls}" ${action} title="${node.effect}">
          <div class="skill-dot"></div>
          <span class="skill-node-name">${node.name}</span>
          ${done
            ? `<span class="skill-check">✓</span>`
            : `<span class="skill-cost">${node.cost}₿</span>`}
        </div>`;
    }
    html += `</div>`;
  }

  el.innerHTML = html;
}

// ── MISSION LIST ──────────────────────────────────────────
export function renderMissionList() {
  const panel = document.getElementById('mission-content');
  const available = MISSIONS.filter(m => !state.completedMissions.includes(m.id));

  if (!available.length) {
    panel.innerHTML = `
      <div class="no-missions fadein">
        <div class="no-missions-icon">🏆</div>
        <div class="no-missions-text">Toutes les missions complétées !</div>
        <div class="no-missions-sub">Rang : ${RANKS[state.rank].name}</div>
      </div>`;
    return;
  }

  const typeColors = {
    phishing: 'var(--blue)',
    hash:     'var(--amber)',
    network:  'var(--green)',
    ctf:      'var(--red)',
  };
  const typeLabels = {
    phishing: 'Phishing',
    hash:     'Hash',
    network:  'Réseau',
    ctf:      'CTF',
  };

  let html = `<div class="panel-title fadein">Missions disponibles (${available.length})</div>`;
  for (const m of available) {
    const color = typeColors[m.type];
    html += `
      <div class="mission-card fadein" onclick="window._startMission('${m.id}')">
        <div class="mission-card-header">
          <span class="mission-card-title">${m.title}</span>
          <span class="mission-badge badge-${m.type}">${typeLabels[m.type]}</span>
        </div>
        <div class="mission-card-desc">${m.description.slice(0, 90)}…</div>
        <div class="mission-card-meta">
          <span class="meta-diff">${'★'.repeat(m.difficulty)}${'☆'.repeat(3 - m.difficulty)}</span>
          <span class="meta-xp">+${m.xpReward} XP</span>
          <span class="meta-credit">+${m.creditReward}₿</span>
        </div>
      </div>`;
  }

  panel.innerHTML = html;
}

// ── MISSION RENDER ────────────────────────────────────────
export function renderMission(mission) {
  const panel = document.getElementById('mission-content');

  const typeLabels = {
    phishing: 'Analyse Phishing',
    hash:     'Déchiffrement Hash',
    network:  'Puzzle Réseau',
    ctf:      'Code Review CTF',
  };

  let inner = '';
  if (mission.type === 'phishing') inner = _phishingHTML(mission);
  if (mission.type === 'hash')     inner = _hashHTML(mission);
  if (mission.type === 'network')  inner = _networkHTML(mission);
  if (mission.type === 'ctf')      inner = _ctfHTML(mission);

  panel.innerHTML = `
    <div class="fadein">
      <div id="mission-title" class="glitch">${mission.title}</div>
      <span class="mission-badge badge-${mission.type}">${typeLabels[mission.type]}</span>
      <div id="mission-description">${mission.description}</div>
      ${inner}
      <div class="action-row">
        <button class="btn" onclick="window._submitMission()">▶ Valider</button>
        <button class="btn danger" onclick="window._backToList()">✕ Abandonner</button>
      </div>
    </div>`;
}

function _phishingHTML(m) {
  const bodyWithLink = m.email.body.replace(
    m.email.link,
    `<a class="email-link" href="#" onclick="return false">${m.email.link}</a>`
  );
  return `
    <div class="email-wrap">
      <div class="email-header-block">
        <div class="email-field"><strong>De :</strong> <span>${m.email.from}</span></div>
        <div class="email-field"><strong>À :</strong> <span>${m.email.to}</span></div>
        <div class="email-field"><strong>Objet :</strong> <span>${m.email.subject}</span></div>
        <div class="email-field"><strong>Date :</strong> <span>${m.email.date}</span></div>
      </div>
      <div class="email-body-block">${bodyWithLink}</div>
    </div>
    <div class="flags-label">▸ Cochez tous les red flags identifiés :</div>
    <div class="flag-list">
      ${m.options.map(o => `
        <div class="flag-item" onclick="this.classList.toggle('selected');this.querySelector('input').checked=!this.querySelector('input').checked">
          <input type="checkbox" value="${o.id}">
          <label>${o.text}</label>
        </div>`).join('')}
    </div>`;
}

function _hashHTML(m) {
  return `
    <div class="flags-label">Hash intercepté :</div>
    <div class="hash-box">${m.hashValue}</div>
    <div class="hash-meta">${m.hashHint}</div>
    <div class="flags-label">▸ Choisissez l'attaque la plus efficace :</div>
    <div class="attack-list">
      ${m.options.map(o => `
        <div class="attack-item" data-id="${o.id}"
          onclick="window._selectSingle(this,'.attack-item');window._sel='${o.id}'">
          <div class="attack-item-name">${o.name}</div>
          <div class="attack-item-desc">${o.description}</div>
        </div>`).join('')}
    </div>`;
}

function _networkHTML(m) {
  return `
    <div class="flags-label">▸ Cliquez sur le service le plus critique :</div>
    <div class="network-grid">
      ${m.nodes.map(n => `
        <div class="net-node" data-id="${n.id}"
          onclick="window._selectSingle(this,'.net-node');window._sel='${n.id}'">
          <span class="net-icon">${n.icon}</span>
          <div>
            <div>
              <span class="net-info-name">${n.name}</span>
              <span class="net-info-ip">${n.ip}</span>
            </div>
            <div class="net-info-ports">${n.ports}</div>
            <div class="net-info-note">${n.note}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

function _ctfHTML(m) {
  return `
    <div class="code-block">
      ${m.code.map(l => `
        <div class="code-row">
          <span class="code-ln">${l.num}</span>
          <span class="code-src">${l.src}</span>
        </div>`).join('')}
    </div>
    <div class="flags-label">▸ Quelle ligne contient la faille critique ?</div>
    <div class="attack-list">
      ${m.options.map(o => `
        <div class="attack-item" data-id="${o.id}"
          onclick="window._selectSingle(this,'.attack-item');window._sel='${o.id}'">
          ${o.label}
        </div>`).join('')}
    </div>`;
}

// ── TOOLTIP ───────────────────────────────────────────────
export function showTooltip(success, mission, xp, credits) {
  const overlay = document.getElementById('tooltip-overlay');
  overlay.classList.remove('hidden');

  overlay.innerHTML = `
    <div class="tip-box fadein">
      <div class="tip-title ${success ? 'ok' : 'ko'}">
        ${success ? '✓ Mission Réussie' : '✗ Mission Échouée'}
      </div>
      <div class="tip-body">
        ${success ? mission.tooltip.success : mission.tooltip.fail}
      </div>
      ${success ? `<div class="tip-reward">Récompense : +${xp} XP | +${credits}₿</div>` : ''}

      <div class="debrief-title">Debriefing</div>
      ${mission.debrief.map(d => `<div class="debrief-item">${d}</div>`).join('')}

      ${mission.type === 'ctf' && mission.fix && success ? `
        <div class="knowledge-box" style="margin-top:12px">
          <div class="debrief-title">Correction</div>
          <pre style="font-size:10px;color:var(--green-dim);white-space:pre-wrap">${mission.fix}</pre>
        </div>` : ''}

      <div class="knowledge-box">
        <div class="debrief-title">📚 Connaissance acquise</div>
        <p>${mission.tooltip.knowledge}</p>
      </div>

      <div class="tip-actions">
        <button class="btn" onclick="window._closeTooltip(${success})">
          ${success ? 'Continuer' : 'Réessayer'}
        </button>
        ${success ? `<button class="btn amber" onclick="window._viewJournal()">📚 Journal</button>` : ''}
      </div>
    </div>`;
}

// ── JOURNAL ───────────────────────────────────────────────
export function renderJournal() {
  const panel = document.getElementById('journal-panel');
  panel.classList.remove('hidden');

  const entries = state.knowledgeJournal;
  let html = `
    <div class="journal-head">
      <div class="panel-title" style="margin:0">📚 Journal (${entries.length})</div>
      <button class="btn danger" style="padding:3px 8px;font-size:10px" onclick="window._closeJournal()">✕</button>
    </div>`;

  if (!entries.length) {
    html += `<div class="empty-msg">Complétez des missions pour remplir votre journal.</div>`;
  } else {
    for (const e of entries) {
      html += `
        <div class="journal-entry">
          <div class="je-title">${e.title}</div>
          <div class="je-body">${e.content}</div>
        </div>`;
    }
  }

  panel.innerHTML = html;
}

// ── RENDER ALL ────────────────────────────────────────────
export function renderAll() {
  renderHeader();
  renderInventory();
  renderSkillTree();
  renderFooter();
  if (!state.currentMission) renderMissionList();
}
