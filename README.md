# **🍳 Cook-Me**

Cook-Me est un projet fullstack en monorepo combinant :

🧠 une API backend (NestJS, Docker)

📱 une application mobile (Expo / React Native)

📦 des packages partagés

L’objectif est de proposer une base stable, maintenable et pédagogique, adaptée à un travail en équipe sur plusieurs semaines.

Repository :
git@github.com:hayamiou/cook-me.git

## 🗂️ Structure du projet

cook-me/
├─ apps/
│  ├─ api/          → API NestJS (Dockerisée)
│  └─ mobile/       → Application mobile Expo
│
├─ packages/
│  ├─ shared-utils/ → Fonctions partagées
│  └─ tsconfig/     → Configuration TypeScript commune
│
├─ docker-compose.yml
├─ Makefile
├─ package.json
├─ pnpm-lock.yaml
└─ README.md

## **📦 Convention de nommage des packages**

Tous les packages du workspace suivent la convention :

@cook-me/<package-name>

## **⚙️ Prérequis**

Node.js ≥ 20

pnpm

Docker

Docker Compose v2 (docker compose)

Make

Environnement Linux / macOS recommandé

Windows → WSL2 fortement recommandé

⚠️ Sur Windows natif, certaines commandes Make peuvent ne pas fonctionner correctement.
Installez WSL2 pour garantir un environnement compatible.

⚠️ Docker & BuildKit (Important)

Le Dockerfile de l’API utilise des fonctionnalités Docker BuildKit :

RUN --mount=type=cache ...

BuildKit est recommandé pour builder l’image.

## **🧰 Setup initial**

### **Cloner le projet :**

git clone git@github.com:hayamiou/cook-me.git
cd cook-me

### **Installer les dépendances :**

pnpm install


## **🚀 Démarrage du projet**


### **🖥️ Ouvrir un 1er terminal pour le backend**

#### Lancer l’API :

make up

#### Arrêter l'API :

make down

#### Checker les logs :

make logs

### **📱 Ouvrir un 2ème terminal pour le front**

**Mode standard (LAN)**

make mobile

Utiliser ce mode si vous êtes sur un réseau Wi-Fi classique.

#### Mode Tunnel

make tunnel

À utiliser si :
- vous êtes sur un réseau restreint (école, entreprise…)
- le mode LAN ne fonctionne pas

## **🧪 Scripts disponibles**

pnpm build

pnpm test

pnpm lint

pnpm lint:fix


## **🔁 Workflow Git**

### **🌱 Création d’une branche**

Toujours créer une branche à partir de origin/develop :

git fetch origin
git switch -c feature/nom-de-la-branche origin/develop


### **💻 Travail sur sa branche**

git add .
git commit -m "feat: add authentication"
git push origin feature/nom-de-la-branche

### **🔄 Mise à jour avant PR (Rebase obligatoire)**

#### Avant toute Pull Request :

git fetch origin

git rebase origin/develop

#### Résoudre les conflits si nécessaire :

git add .

git commit -m "fix: resolve merge conflicts"

git push origin feature/nom-de-la-branche


Rebase jusqu’à absence totale de conflits.

**📥 Pull Request**

PR vers develop

Rebase obligatoire avant merge

Pas de push direct sur develop

Suppression automatique des branches après merge

**🧾 Convention des branches**

feature/CM-21-auth

fix/CM-22-login-bug

chore/update-deps

## **📝 Conventional Commits (obligatoire)**

### Format :

type(scope): description

### Exemples :

feat: add authentication
fix: correct login bug
chore: update dependencies
refactor: improve API structure

### Types principaux :

feat

fix

chore

refactor

docs

test

## **🔐 Commits signés (GPG)**

Les commits doivent être signés avec une clé GPG.

Guide d’installation :

https://formationgit.fr/blog/cles-gpg-et-git-securise-tes-commits-en-5-minutes-chrono

## 🧠 Choix techniques

Turborepo

Exécution parallèle

Cache intelligent

TypeScript

Approche source-first

Pas de pré-build des packages

Biome

Lint + format rapides

Configuration centralisée

## **📌 Résumé**

✔️ Monorepo structuré
✔️ Dockerisé proprement
✔️ Workflow Git strict
✔️ Conventional commits
✔️ Rebase obligatoire
✔️ Compatible équipe multi-environnements



Happy coding 👩‍🍳👨‍🍳