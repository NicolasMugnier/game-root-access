const BOOT_LINES = [
  { text: '[SYS] Root Access OS v1.0.0 — kernel 6.8.0-sec', type: 'system' },
  { text: '[SYS] Chargement modules kernel... OK', type: 'system' },
  { text: '[SYS] Montage filesystem chiffré (AES-256)... OK', type: 'system' },
  { text: '[NET] Connexion Darknet Node #7... OK', type: 'success' },
  { text: '[NET] Couche anonymisation active (TOR × 3 hops)', type: 'info' },
  { text: '[SYS] Identité masquée. Trace impossible.', type: 'success' },
  { text: '─'.repeat(42), type: 'system' },
  { text: '[GAME] Bienvenue, Agent. Les missions vous attendent.', type: 'success' },
];

const AMBIENT_LINES = [
  { text: '[NET] Scan passif réseau 192.168.0.0/16...', type: 'system' },
  { text: '[IDS] Alerte : port scan détecté sur 10.0.0.45', type: 'warn' },
  { text: '[SYS] Rotation clé TOR... OK', type: 'system' },
  { text: '[NET] Nouveau nœud Darknet en ligne : #31', type: 'info' },
  { text: '[LOG] Tentative SSH échouée : root@203.0.113.42', type: 'warn' },
  { text: '[SYS] Mémoire anonymisée. Logs chiffrés.', type: 'system' },
  { text: '[NET] Ping 8.8.8.8... 12ms OK', type: 'system' },
  { text: '[IDS] Trafic suspect détecté sur port 4444', type: 'warn' },
  { text: '[SYS] Processus d\'évasion actif...', type: 'info' },
  { text: '[NET] Proxy SOCKS5 opérationnel', type: 'system' },
  { text: '[LOG] 847 tentatives bruteforce bloquées (24h)', type: 'warn' },
  { text: '[SYS] Chiffrement PGP initialisé', type: 'system' },
];

let logEl = null;
let queue = [];
let isProcessing = false;
let ambientInterval = null;

function getLogEl() {
  if (!logEl) logEl = document.getElementById('terminal-log');
  return logEl;
}

function now() {
  return new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function appendLine(text, type) {
  const el = getLogEl();
  if (!el) return;

  const line = document.createElement('div');
  line.className = `log-line ${type}`;

  const ts = document.createElement('span');
  ts.className = 'log-ts';
  ts.textContent = `[${now()}]`;

  const msg = document.createElement('span');
  msg.className = 'log-msg';
  msg.textContent = text;

  line.appendChild(ts);
  line.appendChild(msg);
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
  return msg;
}

async function typeText(el, text, speed = 16) {
  for (const ch of text) {
    el.textContent += ch;
    await delay(speed + Math.random() * 8);
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  while (queue.length > 0) {
    const { text, type, typed } = queue.shift();
    const msgEl = appendLine('', type);
    if (msgEl) {
      if (typed) {
        await typeText(msgEl, text);
      } else {
        msgEl.textContent = text;
      }
    }
    if (typed) await delay(60);
  }

  isProcessing = false;
}

export function log(text, type = 'info', typed = false) {
  queue.push({ text, type, typed });
  processQueue();
}

export async function bootSequence() {
  for (const line of BOOT_LINES) {
    await delay(120);
    log(line.text, line.type, false);
  }
  await delay(800);
  startAmbient();
}

function startAmbient() {
  if (ambientInterval) return;
  ambientInterval = setInterval(() => {
    const pick = AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
    log(pick.text, pick.type, false);

    const el = getLogEl();
    if (el && el.children.length > 120) {
      while (el.children.length > 80) el.removeChild(el.firstChild);
    }
  }, 4500 + Math.random() * 3000);
}
