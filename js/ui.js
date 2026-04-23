import { state } from './game.js';
import { RANKS, TOOLS, SKILLS, MISSIONS } from './data.js';

// ── BONUS CALCULATION ─────────────────────────────────────
export function computeBonuses(mission) {
  let xpMult     = 1;
  let creditMult = 1;
  const applied  = [];

  const lvl = (id) => state.toolLevels?.[id] || 0;
  const has = (id) => state.inventory.includes(id);

  if (mission.type === 'network' && has('nmap')) {
    const bonus = 0.10 * lvl('nmap');
    xpMult += bonus;
    applied.push(`🔍 Nmap Nv.${lvl('nmap')} : +${Math.round(bonus * 100)}% XP`);
  }
  if (mission.type === 'hash' && has('john')) {
    const bonus = 0.20 * lvl('john');
    xpMult += bonus;
    applied.push(`🔓 John Nv.${lvl('john')} : +${Math.round(bonus * 100)}% XP`);
  }
  if (mission.type === 'ctf' && has('burp')) {
    const bonus = 0.15 * lvl('burp');
    xpMult += bonus;
    applied.push(`🕷️ Burp Nv.${lvl('burp')} : +${Math.round(bonus * 100)}% XP`);
  }
  if (has('metasploit')) {
    const bonus = 0.25 * lvl('metasploit');
    xpMult += bonus;
    applied.push(`💀 Metasploit Nv.${lvl('metasploit')} : +${Math.round(bonus * 100)}% XP`);
  }
  if (has('wireshark')) {
    const bonus = 0.10 * lvl('wireshark');
    creditMult += bonus;
    applied.push(`🦈 Wireshark Nv.${lvl('wireshark')} : +${Math.round(bonus * 100)}% crédits`);
  }
  if (state.skills.osint)        { creditMult += 0.05; applied.push('OSINT Basics : +5% crédits'); }
  if (state.skills.log_analysis) { creditMult += 0.10; applied.push('Log Analysis : +10% crédits'); }
  if (state.skills.threat_intel) { creditMult += 0.25; applied.push('Threat Intel : +25% crédits'); }
  if (state.skills.portscan && mission.type === 'network') { xpMult += 0.15; applied.push('Port Scan Pro : +15% XP'); }
  if (state.skills.sqli && mission.type === 'ctf')         { xpMult += 0.10; applied.push('SQLi Hunter : +10% XP'); }
  if (state.skills.privesc)      { xpMult += 0.20; applied.push('Priv. Escalation : +20% XP'); }

  return {
    finalXP:      Math.round(mission.xpReward * xpMult),
    finalCredits: Math.round(mission.creditReward * creditMult),
    applied,
  };
}

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
  document.getElementById('action-buttons').innerHTML =
    `<button class="btn" onclick="window._backToList()">📋 Missions</button>`;

  const done = state.completedMissions.length;
  document.getElementById('mini-network').innerHTML = `
    <span>NET:</span>
    <div class="mn-node on" title="Vous"></div>
    <div class="mn-edge"></div>
    <div class="mn-node ${done > 0 ? 'hit' : ''}" title="Cible 1"></div>
    <div class="mn-edge"></div>
    <div class="mn-node ${done > 1 ? 'hit' : ''}" title="Cible 2"></div>
    <div class="mn-edge"></div>
    <div class="mn-node ${done > 2 ? 'hit' : ''}" title="Cible 3"></div>
    <span style="margin-left:6px">${done} compromis</span>`;
}

// ── INVENTORY ─────────────────────────────────────────────
function renderInventory() {
  const el    = document.getElementById('tools-inventory');
  const owned = TOOLS.filter(t => state.inventory.includes(t.id));
  const shop  = TOOLS.filter(t => !state.inventory.includes(t.id));

  let html = `<div class="panel-title">Outils (${owned.length}/${TOOLS.length})</div>`;

  for (const t of owned) {
    const lvl   = state.toolLevels[t.id] || 1;
    const stars = '★'.repeat(lvl) + '☆'.repeat(t.maxLevel - lvl);
    const upgradeCost = lvl * 100;
    const canUpgrade  = lvl < t.maxLevel && state.credits >= upgradeCost;
    const maxed       = lvl >= t.maxLevel;

    html += `
      <div class="tool-card">
        <div class="tool-card-head">
          <span class="tool-name">${t.icon} ${t.name}</span>
          <span class="tool-level">Nv.${lvl}</span>
        </div>
        <div class="tool-stars">${stars}</div>
        <div class="tool-bonus">${t.passive}</div>
        <div class="tool-hint" style="font-size:10px;color:#006622;margin-top:3px;font-style:italic">${t.hint}</div>
        ${maxed
          ? `<div style="font-size:10px;color:var(--amber);margin-top:5px">★ Niveau maximum</div>`
          : `<button class="btn amber" style="margin-top:6px;padding:3px 10px;font-size:10px"
              onclick="window._upgradeTool('${t.id}')" ${canUpgrade ? '' : 'disabled'}>
              Améliorer (${upgradeCost}₿)
            </button>`}
      </div>`;
  }

  if (shop.length) {
    html += `<div class="panel-title shop-section">Boutique</div>`;
    for (const t of shop) {
      const canBuy = state.credits >= t.cost;
      html += `
        <div class="tool-card" style="opacity:${canBuy ? '1' : '0.5'}">
          <div class="tool-card-head">
            <span class="tool-name">${t.icon} ${t.name}</span>
            <span class="tool-price">${t.cost}₿</span>
          </div>
          <div class="tool-bonus">${t.passive}</div>
          <div class="tool-hint" style="font-size:10px;color:#006622;margin-top:3px;font-style:italic">${t.hint}</div>
          <button class="btn amber" style="margin-top:6px;padding:3px 10px;font-size:10px"
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

  for (const [, branch] of Object.entries(SKILLS)) {
    html += `<div class="skill-branch">
      <div class="branch-name" style="color:${branch.color}">${branch.name}</div>`;
    for (const node of branch.nodes) {
      const done  = !!state.skills[node.id];
      const reqOk = !node.requires || !!state.skills[node.requires];
      const cls   = done ? 'unlocked' : (!reqOk ? 'locked' : '');
      const click = !done && reqOk
        ? `onclick="window._unlockSkill('${node.id}',${node.cost})"`
        : '';
      html += `
        <div class="skill-node ${cls}" ${click} title="${node.effect}">
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
  const panel     = document.getElementById('mission-content');
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

  const typeColors = { phishing:'var(--blue)', hash:'var(--amber)', network:'var(--green)', ctf:'var(--red)' };
  const typeLabels = { phishing:'Phishing', hash:'Hash', network:'Réseau', ctf:'CTF' };

  let html = `<div class="panel-title fadein">Missions disponibles (${available.length})</div>`;

  for (const m of available) {
    const { finalXP, finalCredits, applied } = computeBonuses(m);
    const hasBonuses = applied.length > 0;
    html += `
      <div class="mission-card fadein" onclick="window._startMission('${m.id}')">
        <div class="mission-card-header">
          <span class="mission-card-title">${m.title}</span>
          <span class="mission-badge badge-${m.type}">${typeLabels[m.type]}</span>
        </div>
        <div class="mission-card-desc">${m.description.slice(0, 90)}…</div>
        <div class="mission-card-meta">
          <span class="meta-diff">${'★'.repeat(m.difficulty)}${'☆'.repeat(3 - m.difficulty)}</span>
          <span class="meta-xp">+${finalXP} XP${hasBonuses ? ' 🔺' : ''}</span>
          <span class="meta-credit">+${finalCredits}₿${hasBonuses ? ' 🔺' : ''}</span>
        </div>
        ${hasBonuses ? `<div style="font-size:10px;color:var(--green-dim);margin-top:6px">
          Bonus actifs : ${applied.map(a => a.split(':')[0]).join(' · ')}
        </div>` : ''}
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

  const { applied } = computeBonuses(mission);
  const bonusBanner = applied.length
    ? `<div class="tool-active-banner">
        ${applied.map(a => `<span>${a}</span>`).join('')}
       </div>`
    : '';

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
      ${bonusBanner}
      ${inner}
      <div class="action-row">
        <button class="btn" onclick="window._submitMission()">▶ Valider</button>
        <button class="btn danger" onclick="window._backToList()">✕ Abandonner</button>
      </div>
    </div>`;
}

// ── PHISHING ──────────────────────────────────────────────
function _phishingHTML(m) {
  const hasPhishingEye = !!state.skills.phishing_eye;
  const hintIds        = m.phishingEyeHints || [];

  const bodyWithLink = m.email.body.replace(
    m.email.link,
    `<a class="email-link" href="#" onclick="return false">${m.email.link}</a>`
  );

  const hintBanner = hasPhishingEye
    ? `<div class="tool-hint-banner">🛡️ Phishing Eye actif — ${hintIds.length} leurre(s) identifié(s) comme inoffensifs</div>`
    : '';

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
    ${hintBanner}
    <div class="flags-label">▸ Cochez tous les red flags identifiés :</div>
    <div class="flag-list">
      ${m.options.map(o => {
        const isHinted = hasPhishingEye && hintIds.includes(o.id);
        return `
          <div class="flag-item${isHinted ? ' hint-safe' : ''}"
            onclick="${isHinted ? '' : "this.classList.toggle('selected');this.querySelector('input').checked=!this.querySelector('input').checked"}">
            <input type="checkbox" value="${o.id}" ${isHinted ? 'disabled' : ''}>
            <label>${o.text}</label>
            ${isHinted ? `<span class="hint-tag safe">✓ Inoffensif</span>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}

// ── HASH ──────────────────────────────────────────────────
function _hashHTML(m) {
  const hasJohn = state.inventory.includes('john');
  const hintBanner = hasJohn
    ? `<div class="tool-hint-banner">🔓 John the Ripper actif — attaques inadaptées identifiées</div>`
    : '';

  return `
    <div class="flags-label">Hash intercepté :</div>
    <div class="hash-box">${m.hashValue}</div>
    <div class="hash-meta">${m.hashHint}</div>
    ${hintBanner}
    <div class="flags-label">▸ Choisissez l'attaque la plus efficace :</div>
    <div class="attack-list">
      ${m.options.map(o => {
        const elim  = hasJohn && o.johnElim;
        const slow  = hasJohn && o.johnHint;
        return `
          <div class="attack-item${elim ? ' hint-elim' : ''}" data-id="${o.id}"
            onclick="${elim ? '' : `window._selectSingle(this,'.attack-item');window._sel='${o.id}'`}">
            <div class="attack-item-name">${o.name}
              ${elim ? `<span class="hint-tag elim">❌ Non adapté à MD5</span>` : ''}
              ${slow ? `<span class="hint-tag warn">⚠ Lent — tables plus rapides</span>` : ''}
            </div>
            <div class="attack-item-desc">${o.description}</div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── NETWORK ───────────────────────────────────────────────
function _networkHTML(m) {
  const hasNmap = state.inventory.includes('nmap');
  const nmapLvl = state.toolLevels['nmap'] || 1;
  const hintBanner = hasNmap
    ? `<div class="tool-hint-banner">🔍 Nmap Nv.${nmapLvl} actif — analyse de risque en cours…</div>`
    : '';

  const riskColors = { LOW: '#006622', MEDIUM: 'var(--amber)', HIGH: 'var(--red)', CRITIQUE: 'var(--red)' };

  return `
    ${hintBanner}
    <div class="flags-label">▸ Cliquez sur le service le plus critique :</div>
    <div class="network-grid">
      ${m.nodes.map(n => {
        const showRisk = hasNmap;
        const riskColor = riskColors[n.riskLevel] || 'var(--green-dim)';
        return `
          <div class="net-node" data-id="${n.id}"
            onclick="window._selectSingle(this,'.net-node');window._sel='${n.id}'">
            <span class="net-icon">${n.icon}</span>
            <div style="flex:1">
              <div>
                <span class="net-info-name">${n.name}</span>
                <span class="net-info-ip">${n.ip}</span>
              </div>
              <div class="net-info-ports">${n.ports}</div>
              <div class="net-info-note">${n.note}</div>
              ${showRisk ? `
                <div style="margin-top:5px;display:flex;align-items:center;gap:8px">
                  <div style="height:3px;flex:1;background:var(--green-dark);border-radius:2px">
                    <div style="height:100%;width:${n.riskLevel === 'CRITIQUE' ? '100' : n.riskLevel === 'HIGH' ? '75' : n.riskLevel === 'MEDIUM' ? '45' : '15'}%;background:${riskColor};border-radius:2px"></div>
                  </div>
                  <span style="font-size:10px;color:${riskColor};font-weight:700;min-width:52px">
                    ${n.riskLevel}
                    ${nmapLvl >= 3 ? `<br><span style="font-weight:normal;color:var(--green-dim)">${n.riskReason.split(' ').slice(0,4).join(' ')}…</span>` : ''}
                  </span>
                </div>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── CTF ───────────────────────────────────────────────────
function _ctfHTML(m) {
  const hasBurp = state.inventory.includes('burp');
  const hintBanner = hasBurp
    ? `<div class="tool-hint-banner">🕷️ Burp Suite actif — inspection du code en cours…</div>`
    : '';

  return `
    ${hintBanner}
    <div class="code-block">
      ${m.code.map(l => {
        const suspect = hasBurp && l.burpSuspect;
        return `
          <div class="code-row${suspect ? ' burp-suspect' : ''}">
            <span class="code-ln">${l.num}</span>
            <span class="code-src">${l.src}</span>
            ${suspect ? `<span class="hint-tag warn" style="margin-left:12px">⚠ Suspect</span>` : ''}
          </div>`;
      }).join('')}
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
export function showTooltip(success, mission, xp, credits, bonuses = []) {
  const overlay = document.getElementById('tooltip-overlay');
  overlay.classList.remove('hidden');

  const bonusHtml = bonuses.length
    ? `<div style="margin-bottom:12px;padding:8px;border:1px solid var(--border);font-size:11px">
        <div class="debrief-title" style="margin-bottom:6px">Bonus appliqués</div>
        ${bonuses.map(b => `<div style="color:var(--green-dim)">▸ ${b}</div>`).join('')}
       </div>`
    : '';

  overlay.innerHTML = `
    <div class="tip-box fadein">
      <div class="tip-title ${success ? 'ok' : 'ko'}">
        ${success ? '✓ Mission Réussie' : '✗ Mission Échouée'}
      </div>
      <div class="tip-body">${success ? mission.tooltip.success : mission.tooltip.fail}</div>
      ${success ? `<div class="tip-reward">Récompense : +${xp} XP | +${credits}₿</div>` : ''}
      ${success ? bonusHtml : ''}

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

  html += entries.length
    ? entries.map(e => `
        <div class="journal-entry">
          <div class="je-title">${e.title}</div>
          <div class="je-body">${e.content}</div>
        </div>`).join('')
    : `<div class="empty-msg">Complétez des missions pour remplir votre journal.</div>`;

  panel.innerHTML = html;
}

// ── RE-RENDER ACTIVE MISSION (preserve selections) ────────
function reRenderActiveMission() {
  const mission = MISSIONS.find(m => m.id === state.currentMission);
  if (!mission) return;

  // Capture current selections before wiping the DOM
  const savedSel   = window._sel;
  const savedFlags = mission.type === 'phishing'
    ? Array.from(document.querySelectorAll('.flag-item.selected input')).map(el => el.value)
    : [];

  renderMission(mission);

  // Restore selections after re-render
  window._sel = savedSel;

  if (mission.type === 'phishing') {
    savedFlags.forEach(id => {
      const input = document.querySelector(`.flag-item input[value="${id}"]`);
      if (input && !input.disabled) {
        input.checked = true;
        input.closest('.flag-item').classList.add('selected');
      }
    });
  } else if (savedSel) {
    const selector = mission.type === 'network' ? '.net-node' : '.attack-item';
    document.querySelector(`${selector}[data-id="${savedSel}"]`)?.classList.add('selected');
  }
}

// ── RENDER ALL ────────────────────────────────────────────
export function renderAll() {
  renderHeader();
  renderInventory();
  renderSkillTree();
  renderFooter();
  if (state.currentMission) {
    reRenderActiveMission();
  } else {
    renderMissionList();
  }
}
