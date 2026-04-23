# Root Access — Jeu web cybersécurité

## Concept
RPG incremental / roguelite dans une ambiance terminal cyberpunk.
Le joueur incarne un hacker éthique qui monte en grade en résolvant
des missions de cybersécurité. Objectif : fun + pédagogie accessibles
au grand public.

## Progression
Rangs : Script Kiddie → Pentester → Red Teamer → CISO
Monnaie : Crédits (achat d'outils)
XP : gagnée sur chaque mission réussie
Compétences : arbre en 3 branches (Reconnaissance, Exploitation, Défense)

## Outils (cartes upgradables)
Nmap, Burp Suite, Metasploit, Wireshark, John the Ripper...
Chaque outil a un niveau et des bonus passifs.

## Types de missions
- Puzzle réseau : identifier une faille sur un schéma de réseau cliquable
- Déchiffrement : choisir la bonne attaque face à un hash
- Phishing : analyser un faux email et identifier les red flags
- CTF mini : spotter une faille dans du pseudo-code

## Layout (3 colonnes)
- Gauche : terminal log (faux terminal qui défile en temps réel)
- Centre : mission active (change selon le type)
- Droite : inventaire outils (cartes) + skill tree

Header : avatar ASCII + rang + barre XP + crédits
Footer : boutons d'actions contextuels + mini carte réseau

## UX pédagogique
- Tooltip éducative après chaque action (réussie ou ratée)
- Journal de connaissances qui se remplit automatiquement
- Debriefing après chaque mission

## Stack technique
- Vanilla JS (ES modules)
- CSS custom (pas de framework)
- Persistance localStorage
- Pas de backend, pas de bundler
- Déployable sur GitHub Pages tel quel

## Structure de fichiers cible
root-access/
├── index.html
├── style.css
└── js/
    ├── game.js       # state central + boucle de jeu
    ├── terminal.js   # log animé (typing effect)
    ├── missions.js   # logique et vérification des missions
    ├── ui.js         # rendu et mise à jour du DOM
    └── data.js       # outils, skills, missions (objets JS)

## Ambiance visuelle
Fond noir, texte vert phosphorescent, police monospace (JetBrains Mono
ou Fira Code via Google Fonts), effets glitch subtils, scanlines
légères, animations typing pour les logs terminal.

## Priorités d'implémentation (dans l'ordre)
1. index.html + style.css : layout 3 colonnes + header + footer
2. terminal.js : log animé avec effet typing
3. data.js : 3-4 missions initiales + 2-3 outils
4. missions.js : première mission fonctionnelle (type phishing)
5. game.js : state central (XP, crédits, rang, inventaire)
6. ui.js : mise à jour du DOM sur chaque changement de state
7. Persistance localStorage dans game.js
8. Missions supplémentaires + skill tree

## Conventions de code
- ES modules natifs (import/export), pas de bundler
- Pas de framework, pas de dépendances npm
- State central unique dans game.js, les autres modules l'importent
- Fonctions de rendu pures dans ui.js (reçoivent le state, retournent/modifient le DOM)

## Démarrage suggéré
Commence par index.html et style.css pour poser le layout complet.
Ensuite terminal.js avec quelques lignes de log hardcodées pour valider
l'ambiance visuelle avant d'attaquer la logique de jeu.
