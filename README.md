
# YOON

YOON est une plateforme numérique dédiée à l’accès au droit au Sénégal.
Son objectif est de faciliter l’accès aux informations juridiques et de mettre en relation les citoyens avec des experts du domaine.

Dans un contexte où l’accès aux services juridiques reste complexe, coûteux et peu accessible, YOON propose une solution digitale innovante pour démocratiser l’accès au droit.

https://github.com/user-attachments/assets/c7f70836-ef92-4a11-a744-25a26b239651

## Sommaire

- Présentation
- Problématique
- Objectifs
- Fonctionnalités
- Architecture
- Démarrage rapide
- Données juridiques (SQL / Supabase)
- Comptes de démonstration
- Scripts

## Présentation

Le dépôt contient principalement une application **frontend** (web + mobile via Capacitor) qui illustre :

- Une expérience de consultation/recherche de contenus juridiques
- Des écrans de messagerie, consultations et paiements (UI)
- Une authentification de démonstration basée sur le stockage local

## Problématique

Au Sénégal, plusieurs difficultés limitent l’accès au droit :

- Dispersion des textes juridiques (Journal Officiel, sites gouvernementaux, etc.)
- Complexité du langage juridique difficile à comprendre pour les citoyens
- Coût élevé des services juridiques
- Difficulté d’accès aux experts (distance, disponibilité)
- Manque de plateformes numériques dédiées

## Objectifs

Le projet YOON vise à :

- Centraliser les textes juridiques sénégalais
- Faciliter leur recherche et leur compréhension
- Mettre en relation les citoyens et les experts juridiques
- Réduire les coûts d’accès aux services juridiques
- Promouvoir l’inclusion numérique

## Fonctionnalités principales

- Recherche de textes juridiques et navigation par catégories
- Mise en relation avec des experts juridiques
- Demande et gestion de consultations
- Messagerie entre citoyens et experts
- Gestion de méthodes de paiement (ex: Orange Money) (UI)
- Interface web responsive

## Architecture technique

Le projet repose sur une architecture client-serveur moderne.

- **Frontend**
  - React + TypeScript
  - Vite
  - TailwindCSS
  - React Router
  - Capacitor (Android/iOS)
- **Backend / API**
  - À intégrer selon l’environnement cible (le repo contient surtout le frontend).
- **Base de données / contenu juridique**
  - Des scripts SQL sont fournis pour initialiser une table `legal_content` (voir plus bas).

## Acteurs du système

- **Citoyen**
  - Recherche des informations
  - Consulte des experts
- **Expert juridique**
  - Fournit des services et conseils
- **Administrateur**
  - Gère la plateforme

## Impact

YOON contribue à :

- Améliorer l’accès à la justice
- Réduire les inégalités face au droit
- Moderniser les services juridiques au Sénégal
- Renforcer la sensibilisation juridique des citoyens

## Conclusion

YOON est une solution innovante qui combine technologie et droit pour créer un système accessible, structuré et inclusif, adapté aux réalités du contexte sénégalais.

## Démarrage rapide

### Prérequis

- Node.js (LTS recommandé)
- npm

### Installation

```bash
npm install
```

### Lancer en local

```bash
npm run dev
```

Puis ouvre l’URL affichée par Vite (souvent `http://localhost:5173`).

### Build web

```bash
npm run build
```

### Preview du build

```bash
npm run preview
```

## Build mobile (Capacitor)

Le projet est configuré avec Capacitor (`appId: com.yoon.app`, `webDir: dist`).

- Build web:

```bash
npm run build
```

- Synchroniser Capacitor:

```bash
npx cap sync
```

- Ouvrir les projets natifs:

```bash
npx cap open android
npx cap open ios
```

## Données juridiques (SQL / Supabase)

Le repo contient des scripts SQL pour créer une table de contenus juridiques et injecter des exemples :

- `create_tables.sql`
- `insert_legal_content.sql`

Ces scripts sont indiqués comme destinés à Supabase (exécution via l’interface SQL Supabase).

## Comptes de démonstration

L’authentification côté app utilise un stockage local (LocalStorage) et expose des comptes de démonstration :

- `expert@yoon.sn` / `expert123`
- `citizen@yoon.sn` / `citizen123`
- `admin@yoon.sn` / `admin123`

## Scripts

- `npm run dev`: serveur de dev Vite
- `npm run build`: build production
- `npm run preview`: prévisualiser le build
- `npm run lint`: lint
- `npm run typecheck`: vérification TypeScript

## Structure du projet

- `src/`: application React (pages, composants, contextes)
- `android/`, `ios/`: projets natifs Capacitor
- `create_tables.sql`, `insert_legal_content.sql`: scripts SQL (initialisation + exemples)

## Contribuer

- Ouvre une issue pour décrire le besoin (bug, amélioration, feature)
- Propose une PR avec une description claire et des étapes de test

## Licence

Licence non spécifiée pour le moment. Ajoute un fichier `LICENSE` si tu souhaites clarifier les conditions d’utilisation.

## Avertissement

Les informations juridiques et résumés affichés par l’application ne constituent pas un avis juridique. Pour une situation concrète, consulte un professionnel.

