# 🍳 Cook-Me

> **Cook-Me** est un projet fullstack en **monorepo** combinant :
> - une **API backend** (NestJS, Docker)
> - une **application mobile** (Expo / React Native)
> - des **packages partagés**
>
> L’objectif est de proposer une base **stable, maintenable et pédagogique**, adaptée à un **travail en équipe sur plusieurs semaines**.

---

## 🗂️ Structure du projet

```text
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
```

### Convention de nommage

Tous les packages du workspace suivent la convention :

```text
@cook-me/<package-name>
```

---

## ⚙️ Prérequis

- **Node.js ≥ 20**
- **pnpm**
- **Docker**
- **Docker Compose v2** (`docker compose`)
- (Recommandé) **WSL / Linux** pour les environnements Windows

---

## ⚠️ Docker & BuildKit (important)

Le `Dockerfile` de l’API utilise des fonctionnalités **Docker BuildKit** :

```dockerfile
RUN --mount=type=cache ...
```

👉 **BuildKit est obligatoire** pour builder l’image.

Toutes les commandes via le **Makefile** activent BuildKit automatiquement.

---

## 🧰 Setup initial

```bash
pnpm install
```

### IDE
- Installer l’extension **Biome**
- Biome remplace ESLint + Prettier

---

## 🚀 Démarrage rapide (workflow recommandé)

### 🖥️ Terminal 1 — Backend

```bash
make up
```

Mode détaché :

```bash
make up-d
```

Arrêter :

```bash
make down
```

---

### 📱 Terminal 2 — Mobile (Expo)

```bash
make mobile
```

Tunnel :

```bash
make tunnel
```

---

## 🧪 Scripts

```bash
pnpm build
pnpm test
pnpm lint
pnpm lint:fix
```

---

## 🧩 Commandes Makefile

```bash
make build
make up
make up-d
make down
make logs
make ps
make clean
```

---

## 🧠 Choix techniques

### Turborepo
- Exécution parallèle
- Cache intelligent

### TypeScript
- Approche **source-first**
- Pas de pré-build des packages

### Biome
- Lint + format rapides
- Configuration centralisée

---

## 📌 Résumé

✔️ Projet stable  
✔️ Prêt pour le travail en équipe  
✔️ Workflow clair et reproductible

Happy coding 👩‍🍳👨‍🍳