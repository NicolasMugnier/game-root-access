export const RANKS = [
  { name: 'Script Kiddie', minXP: 0    },
  { name: 'Pentester',     minXP: 500  },
  { name: 'Red Teamer',    minXP: 1500 },
  { name: 'CISO',          minXP: 3000 },
];

export const TOOLS = [
  {
    id: 'nmap',
    name: 'Nmap',
    icon: '🔍',
    description: 'Scanner de ports et détection de services réseau',
    level: 1,
    maxLevel: 5,
    cost: 0,
    passive: '+10% XP sur missions réseau',
  },
  {
    id: 'john',
    name: 'John the Ripper',
    icon: '🔓',
    description: 'Craqueur de mots de passe (dictionnaire & brute-force)',
    level: 0,
    maxLevel: 5,
    cost: 100,
    passive: '+20% XP sur missions hash',
  },
  {
    id: 'burp',
    name: 'Burp Suite',
    icon: '🕷️',
    description: 'Proxy d\'interception et scanner de vulnérabilités web',
    level: 0,
    maxLevel: 5,
    cost: 150,
    passive: '+15% XP sur missions CTF web',
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    icon: '🦈',
    description: 'Analyseur de trafic réseau en temps réel',
    level: 0,
    maxLevel: 5,
    cost: 200,
    passive: 'Révèle des métadonnées supplémentaires',
  },
  {
    id: 'metasploit',
    name: 'Metasploit',
    icon: '💀',
    description: 'Framework d\'exploitation de vulnérabilités',
    level: 0,
    maxLevel: 5,
    cost: 350,
    passive: '+25% crédits sur missions réseau',
  },
];

export const SKILLS = {
  recon: {
    name: 'Reconnaissance',
    color: 'var(--green)',
    nodes: [
      { id: 'osint',       name: 'OSINT Basics',       cost: 50,  requires: null,        effect: '+5% crédits par mission' },
      { id: 'portscan',    name: 'Port Scan Pro',       cost: 100, requires: 'osint',     effect: '+15% XP missions réseau' },
      { id: 'fingerprint', name: 'OS Fingerprinting',   cost: 150, requires: 'portscan',  effect: 'Révèle les OS sur le réseau' },
    ],
  },
  exploit: {
    name: 'Exploitation',
    color: 'var(--red)',
    nodes: [
      { id: 'sqli',     name: 'SQLi Hunter',       cost: 75,  requires: null,    effect: '+10% XP missions CTF SQL' },
      { id: 'xss',      name: 'XSS Master',        cost: 100, requires: 'sqli',  effect: '+10% XP missions CTF web' },
      { id: 'privesc',  name: 'Priv. Escalation',  cost: 200, requires: 'xss',   effect: 'Débloquer missions avancées' },
    ],
  },
  defense: {
    name: 'Défense',
    color: 'var(--blue)',
    nodes: [
      { id: 'phishing_eye', name: 'Phishing Eye',   cost: 50,  requires: null,           effect: '+3 indices sur missions phishing' },
      { id: 'log_analysis', name: 'Log Analysis',   cost: 100, requires: 'phishing_eye', effect: 'Voir les logs détaillés' },
      { id: 'threat_intel', name: 'Threat Intel',   cost: 175, requires: 'log_analysis', effect: '+25% crédits par mission' },
    ],
  },
};

export const MISSIONS = [
  {
    id: 'phishing_paypal',
    type: 'phishing',
    title: 'Alerte : Email Suspect',
    difficulty: 1,
    xpReward: 80,
    creditReward: 50,
    description: 'Un employé a transféré cet email au SOC. Analysez-le et cochez tous les red flags que vous identifiez.',
    email: {
      from: 'securite@paypa1-support.com',
      to: 'jean.dupont@entreprise.fr',
      subject: 'URGENT : Votre compte PayPal a été suspendu',
      date: '23 Avr 2026, 03:47',
      body:
`Cher client PayPal,

Nous avons détécté une activité SUSPECTE sur votre compte.
Votre accès a été temporairement SUSPENDU pour votre sécurité.

Pour réactiver votre compte dans les 24h, cliquez ici :

  http://paypa1-secure-login.ru/verify?token=JD8847

Si vous n'agissez pas immédiatement, votre compte sera DÉFINITIVEMENT
supprimé et vos fonds seront bloqués.

Cordialement,
L'équipe Securité PayPal
service.client@paypal.com`,
      link: 'http://paypa1-secure-login.ru/verify?token=JD8847',
    },
    options: [
      { id: 'a', text: 'L\'expéditeur utilise "paypa1" (chiffre 1) au lieu de "paypal"', correct: true },
      { id: 'b', text: 'L\'email est rédigé en français', correct: false },
      { id: 'c', text: 'Le lien pointe vers un domaine .ru sans rapport avec PayPal', correct: true },
      { id: 'd', text: 'Le message crée une urgence artificielle ("URGENT", "24h", "immédiatement")', correct: true },
      { id: 'e', text: 'Fautes typographiques : "détécté" et "Securité" (accents erronés)', correct: true },
      { id: 'f', text: 'L\'email est envoyé à 3h47 du matin', correct: true },
      { id: 'g', text: 'PayPal est une entreprise américaine', correct: false },
      { id: 'h', text: 'L\'email contient une menace de suppression de compte', correct: true },
    ],
    tooltip: {
      success: 'Excellent ! Vous avez maîtrisé l\'analyse de phishing. Ces techniques reproduisent les attaques réelles qui ciblent des millions de personnes chaque jour.',
      fail: 'Pas tout à fait. Les indices clés : domaine "paypa1" (typosquatting), TLD .ru du lien, urgence artificielle, fautes typographiques, heure d\'envoi suspecte, et menace de suppression.',
      knowledge: 'Le phishing est responsable de 36% des violations de données (Verizon DBIR 2024). Les attaquants imitent des marques connues et exploitent la peur et l\'urgence pour court-circuiter le raisonnement critique.',
    },
    debrief: [
      'Le typosquatting (paypa1 vs paypal) exploite les fautes de lecture rapide.',
      'Vérifiez TOUJOURS le domaine de l\'expéditeur — le nom affiché peut être falsifié.',
      'Survolez un lien avant de cliquer pour voir l\'URL réelle dans la barre de statut.',
      'Un prestataire légitime ne vous demandera jamais vos identifiants par email.',
    ],
  },

  {
    id: 'hash_md5',
    type: 'hash',
    title: 'Operation Hash Buster',
    difficulty: 1,
    xpReward: 60,
    creditReward: 40,
    description: 'Vous avez intercepté un hash extrait d\'une base de données non chiffrée. Identifiez l\'algorithme et choisissez l\'attaque la plus efficace.',
    hashValue: '5f4dcc3b5aa765d61d8327deb882cf99',
    hashHint: '32 caractères hexadécimaux • pas de salt détecté',
    options: [
      {
        id: 'rainbow',
        name: 'Rainbow Table Attack',
        description: 'Recherche dans des tables précalculées de millions de hashes connus.',
        correct: true,
        explanation: 'Correct ! MD5 sans salt est indexé dans toutes les rainbow tables publiques. Ce hash correspond à "password" — craqué en < 1 seconde sur crackstation.net.',
      },
      {
        id: 'brute',
        name: 'Brute Force (8 caractères)',
        description: 'Teste exhaustivement toutes les combinaisons de caractères possibles.',
        correct: false,
        explanation: 'Fonctionnel, mais inefficace ici. MD5 est rapide à calculer (10 milliards/sec sur GPU), mais les rainbow tables sont encore plus rapides pour les mots de passe communs.',
      },
      {
        id: 'bcrypt_crack',
        name: 'Bcrypt Cracker spécialisé',
        description: 'Outil optimisé pour attaquer les hashes bcrypt avec work factor.',
        correct: false,
        explanation: 'Ce hash n\'est pas en bcrypt. Bcrypt commence toujours par "$2b$" ou "$2a$" suivi du cost factor.',
      },
      {
        id: 'social',
        name: 'Social Engineering',
        description: 'Manipuler l\'utilisateur pour obtenir son mot de passe directement.',
        correct: false,
        explanation: 'Hors scope et illégal sans autorisation écrite. Dans un pentest réel, cette technique existe mais ne s\'applique pas ici.',
      },
    ],
    tooltip: {
      success: 'Parfait ! MD5 sans salt est l\'un des hashes les plus faibles. Ce hash correspond à "password" — un mot de passe présent dans toutes les listes de dictionnaires.',
      fail: 'MD5 sans salt est vulnérable aux rainbow tables par définition. Le salt sert précisément à rendre ces tables inutilisables en rendant chaque hash unique.',
      knowledge: 'MD5 ne doit JAMAIS servir à stocker des mots de passe. Les standards actuels sont bcrypt, Argon2id ou scrypt, avec un salt unique et aléatoire par utilisateur.',
    },
    debrief: [
      'MD5 a été conçu pour la vérification d\'intégrité de fichiers, pas pour les mots de passe.',
      'Des sites comme crackstation.net contiennent des milliards de hashes précalculés.',
      'Un salt aléatoire unique par mot de passe rend les rainbow tables totalement inutiles.',
      'En 2026, bcrypt (cost≥12) ou Argon2id sont les recommandations NIST et OWASP.',
    ],
  },

  {
    id: 'network_exposed',
    type: 'network',
    title: 'Scan Réseau : Surface d\'Attaque',
    difficulty: 2,
    xpReward: 100,
    creditReward: 75,
    description: 'Nmap vient de scanner le réseau interne de la cible. Identifiez le service qui représente la vulnérabilité la plus critique à exploiter en priorité.',
    nodes: [
      {
        id: 'router',
        icon: '🔀',
        name: 'Routeur Cisco',
        ip: '192.168.1.1',
        ports: '22/tcp (SSH) • 80/tcp (HTTP→HTTPS) • 443/tcp (HTTPS)',
        note: 'Firmware v15.2 — à jour • SSH : auth par clé uniquement',
        vulnerable: false,
        reason: 'SSH avec authentification par clé est sécurisé. HTTP redirige vers HTTPS. Firmware à jour.',
      },
      {
        id: 'webserver',
        icon: '🌐',
        name: 'Serveur Web',
        ip: '192.168.1.10',
        ports: '80/tcp (HTTP) • 8080/tcp (HTTP-alt) • 3306/tcp (MySQL)',
        note: 'Apache 2.2.8 (EOL 2018) • MySQL exposé publiquement',
        vulnerable: true,
        reason: 'Double vulnérabilité critique : MySQL (3306) exposé sur internet + Apache 2.2.8 non maintenu depuis 2018 (CVEs non patchées).',
      },
      {
        id: 'workstation',
        icon: '💻',
        name: 'Poste de travail',
        ip: '192.168.1.50',
        ports: '445/tcp (SMB) • 3389/tcp (RDP)',
        note: 'Windows 11 — derniers patchs appliqués (2026-04)',
        vulnerable: false,
        reason: 'SMB et RDP sont ouverts mais le poste est entièrement patché. Risque modéré, pas prioritaire.',
      },
      {
        id: 'printer',
        icon: '🖨️',
        name: 'Imprimante HP',
        ip: '192.168.1.99',
        ports: '9100/tcp (RAW) • 80/tcp (Admin HTTP)',
        note: 'Interface admin sans authentification — firmware 2019',
        vulnerable: false,
        reason: 'L\'interface admin sans mot de passe est un problème réel, mais moins critique que MySQL exposé.',
      },
    ],
    correctNodeId: 'webserver',
    tooltip: {
      success: 'Excellent ! Le serveur web est la cible prioritaire. MySQL (3306) exposé sur internet permet des attaques directes sur la base de données. Apache 2.2.8 est en fin de vie depuis 2018 : aucun patch de sécurité depuis des années.',
      fail: 'Le serveur web était la cible. MySQL ne doit JAMAIS écouter sur une interface publique. Apache 2.2.8 est abandonné depuis 2018 — des dizaines de CVEs critiques non corrigées.',
      knowledge: 'Principe du moindre privilège réseau : chaque service expose uniquement les ports nécessaires, aux hôtes nécessaires. MySQL doit écouter sur 127.0.0.1 uniquement, jamais sur 0.0.0.0.',
    },
    debrief: [
      'Port 3306 ouvert sur internet = invitation ouverte pour un attaquant distant.',
      'Apache 2.2.x est End-of-Life depuis décembre 2017 — plus de patches de sécurité.',
      'L\'audit de surface d\'attaque commence toujours par un scan Nmap exhaustif (-sV -sC).',
      '"Security by default" : tout ce qui n\'est pas explicitement nécessaire doit être désactivé.',
    ],
  },

  {
    id: 'ctf_sqli',
    type: 'ctf',
    title: 'Code Review : Find the Bug',
    difficulty: 2,
    xpReward: 120,
    creditReward: 90,
    description: 'Vous auditez ce code PHP d\'une application web en production. Trouvez la ligne contenant la faille de sécurité la plus critique.',
    code: [
      { num: 1,  src: '<span class="kw">&lt;?php</span>' },
      { num: 2,  src: '' },
      { num: 3,  src: '<span class="kw">function</span> <span class="var">getUser</span>(<span class="var">$username</span>) {' },
      { num: 4,  src: '&nbsp;&nbsp;<span class="var">$db</span> = <span class="kw">new</span> PDO(<span class="str">\'mysql:host=localhost;dbname=app\'</span>);' },
      { num: 5,  src: '&nbsp;&nbsp;<span class="var">$query</span> = <span class="str">"SELECT * FROM users WHERE name = \'"</span>' },
      { num: 6,  src: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; . <span class="var">$username</span> . <span class="str">"\'"</span>;' },
      { num: 7,  src: '&nbsp;&nbsp;<span class="var">$result</span> = <span class="var">$db</span>-&gt;query(<span class="var">$query</span>);' },
      { num: 8,  src: '&nbsp;&nbsp;<span class="kw">return</span> <span class="var">$result</span>-&gt;fetch();' },
      { num: 9,  src: '}' },
      { num: 10, src: '' },
      { num: 11, src: '<span class="comment">// Appel depuis le contrôleur :</span>' },
      { num: 12, src: '<span class="var">$user</span> = <span class="var">getUser</span>(<span class="var">$_GET</span>[<span class="str">\'username\'</span>]);' },
    ],
    options: [
      { id: 'l4',  label: 'Ligne 4  — Connexion PDO sans options de sécurité', correct: false },
      { id: 'l56', label: 'Lignes 5-6 — Concaténation directe de $username dans la requête SQL', correct: true },
      { id: 'l7',  label: 'Ligne 7  — Utilisation de query() au lieu de prepare()', correct: false },
      { id: 'l12', label: 'Ligne 12 — Lecture de $_GET sans validation ni filtrage', correct: false },
    ],
    tooltip: {
      success: 'Exact ! Les lignes 5-6 construisent la requête par concaténation directe. Un attaquant peut entrer : \' OR \'1\'=\'1 pour contourner l\'auth, ou \'; DROP TABLE users;-- pour détruire la base.',
      fail: 'La faille est aux lignes 5-6. La concaténation de $username non sanitisé crée une injection SQL. La ligne 12 contribue (pas de validation), mais la source est la construction de la requête.',
      knowledge: 'Les injections SQL sont dans le Top 3 OWASP depuis 2010. La solution définitive : les requêtes préparées (prepare/execute) séparent le code SQL des données utilisateur — l\'injection devient structurellement impossible.',
    },
    fix: '// VERSION SÉCURISÉE :\n$stmt = $db->prepare("SELECT * FROM users WHERE name = ?");\n$stmt->execute([$username]);\n$result = $stmt->fetch();',
    debrief: [
      'Les requêtes préparées séparent code SQL et données : l\'injection est impossible.',
      'Payload classique : \' OR \'1\'=\'1 contourne une auth, \'--\' commente le reste.',
      'En pire cas, SQLi permet de dumper la DB entière, écrire des fichiers ou exécuter des commandes OS.',
      'Règle d\'or : ne jamais faire confiance à une entrée externe — valider, puis paramétrer.',
    ],
  },
];
