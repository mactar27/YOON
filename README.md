# YOON

YOON est une plateforme numérique dédiée à l’accès au droit au Sénégal.
Son objectif est de faciliter l’accès aux informations juridiques et de mettre en relation les citoyens avec des experts du domaine.

Dans un contexte où l’accès aux services juridiques reste complexe, coûteux et peu accessible, YOON propose une solution digitale innovante pour démocratiser l’accès au droit.

## 🎥 Demo Video

<p align="center">
  <video src="https://github.com/user-attachments/assets/06d7b811-8394-4fd8-a801-1cd150a6ea8d" controls width="80%"></video>
</p>

## Sommaire

- [Présentation](#présentation)
- [Architecture Technique](#architecture-technique)
- [Fonctionnalités](#fonctionnalités-principales)
- [Démarrage Rapide](#démarrage-rapide)
- [Configuration (.env)](#configuration-env)
- [Structure du Projet](#structure-du-projet)
- [Comptes de Démonstration](#comptes- de-démonstration)
- [Licence](#licence)

## Présentation

YOON est une application multi-plateforme (Web, Android, iOS) qui centralise les textes juridiques sénégalais et simplifie la communication entre citoyens et professionnels du droit.

## Architecture Technique

Le projet repose sur une architecture moderne et robuste :

- **Frontend** : React 18 + TypeScript + Vite + TailwindCSS.
- **Mobile** : Capacitor (intégration native Android/iOS).
- **Backend** : Node.js + Express (API REST).
- **Base de Données** : MySQL (gérée via Docker ou service cloud).
- **Authentification** : Sessions express avec stockage MySQL.

## Fonctionnalités Principales

- **Recherche Juridique** : Consultation et recherche de textes de loi par catégories.
- **Mise en Relation** : Annuaire d'experts et prise de rendez-vous.
- **Messagerie** : Chat sécurisé entre citoyens et experts.
- **Consultations** : Suivi des demandes de conseils juridiques.
- **Paiements** : Interface prête pour Orange Money et autres services (UI).

## Démarrage Rapide

### 1. Prérequis

- Node.js (LTS)
- Docker Desktop (pour la base de données)
- npm

### 2. Base de Données (Docker)

Lancez MySQL avec Docker Compose :
```bash
docker-compose up -d
```

### 3. Backend

Configurez les variables d'environnement dans `backend/.env` (voir section [Configuration](#configuration-env)).

```bash
cd backend
npm install
npm run dev
```
Le backend sera disponible sur `http://localhost:4000`.

### 4. Frontend

```bash
# Dans la racine du projet
npm install
npm run dev
```
Ouvrez `http://localhost:5173` dans votre navigateur.

## Configuration (.env)

Créez un fichier `.env` dans le dossier `backend/` avec les variables suivantes :

```dotenv
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
SESSION_SECRET=votre_secret_aleatoire_ici

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=yoon
MYSQL_PASSWORD=yoon
MYSQL_DATABASE=yoon
```

## Structure du Projet

- `src/` : Application React (pages, composants, contextes).
- `backend/` : Serveur API Express et modèles de données.
- `android/`, `ios/` : Projets natifs Capacitor.
- `public/` : Assets statiques.
- `docker-compose.yml` : Configuration de l'environnement MySQL.

## Build Mobile (Capacitor)

1. Build web : `npm run build`
2. Sync Capacitor : `npx cap sync`
3. Ouvrir nativement : `npx cap open android` ou `ios`

## Comptes de Démonstration

- **Expert** : `expert@yoon.sn` / `expert123`
- **Citoyen** : `citizen@yoon.sn` / `citizen123`
- **Admin** : `admin@yoon.sn` / `admin123`

## Avertissement

Les informations juridiques affichées ne constituent pas un avis juridique officiel. Consultez toujours un professionnel pour vos démarches légales.

## Licence

Licence non spécifiée pour le moment.
