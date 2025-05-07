# OffTrack - Application de Suivi d'Activités PWA

OffTrack est une Progressive Web Application (PWA) permettant de suivre vos activités personnelles en mode hors-ligne. L'application offre une expérience native-like avec des fonctionnalités de synchronisation en arrière-plan et des notifications push.

## Fonctionnalités

- Suivi d'activités personnelles (sport, méditation, lecture, etc.)
- Fonctionnement complet en mode hors-ligne
- Synchronisation automatique en arrière-plan
- Notifications push
- Installation sur l'écran d'accueil
- Interface utilisateur native-like
- Stockage local avec IndexedDB

## Technologies Utilisées

- SvelteKit pour le framework frontend
- Service Workers pour le fonctionnement hors-ligne
- Workbox pour la gestion du cache
- IndexedDB pour le stockage local
- Tailwind CSS pour le style
- Background Sync API pour la synchronisation

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/offtrack.git
cd offtrack
```

2. Installez les dépendances :
```bash
npm install
```

3. Générez les icônes PWA :
```bash
# Assurez-vous d'avoir une image source dans static/icon-source.png
node scripts/generate-icons.js
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez votre navigateur à l'adresse `http://localhost:5173`

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build`.

## Structure du Projet

```
offtrack/
├── src/
│   ├── lib/
│   │   └── db.js           # Configuration IndexedDB
│   ├── routes/
│   │   ├── +layout.svelte  # Layout principal
│   │   └── +page.svelte    # Page d'accueil
│   └── app.css             # Styles globaux
├── static/
│   ├── manifest.json       # Manifeste PWA
│   ├── sw.js              # Service Worker
│   └── icons/             # Icônes PWA générées
├── scripts/
│   └── generate-icons.js   # Script de génération d'icônes
├── workbox-config.js      # Configuration Workbox
├── tailwind.config.js     # Configuration Tailwind CSS
├── postcss.config.js      # Configuration PostCSS
└── package.json
```

## Prérequis pour le Déploiement

Avant de déployer l'application, assurez-vous de :

1. Avoir une image source pour les icônes PWA (`static/icon-source.png`)
2. Générer les icônes PWA avec le script fourni
3. Vérifier que le manifeste PWA est correctement configuré
4. Tester le fonctionnement hors-ligne en mode développement

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
