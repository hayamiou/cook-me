# 🍳 Cook-Me

Cook-Me est un projet fullstack en monorepo combinant :

- 🧠 une API backend (NestJS, Docker)
- 📱 une application mobile (Expo / React Native)
- 🤖 des microservices (AI worker, enricher)
- 📦 des packages partagés

L'objectif est de proposer une base stable, maintenable et pédagogique, adaptée à un travail en équipe sur plusieurs semaines.

Repository : `git@github.com:hayamiou/cook-me.git`

---

## 🗂️ Structure du projet

```
cook-me/
├─ apps/
│  ├─ api/          → API NestJS (port 3001, Dockerisée)
│  ├─ mobile/       → Application mobile Expo
│  ├─ aiworker/     → Microservice IA (NestJS + NATS)
│  └─ enricher/     → Microservice d'enrichissement (NestJS + NATS)
│
├─ packages/
│  ├─ schemas/      → DTOs et entités partagés
│  ├─ ms-utils/     → Schémas d'événements NATS (Zod)
│  ├─ shared-utils/ → Fonctions utilitaires partagées
│  └─ tsconfig/     → Configuration TypeScript commune
│
├─ docker-compose.yml   → Infrastructure complète
├─ Makefile
├─ .env.example
└─ README.md
```

**Infrastructure Docker :** MongoDB, Redis, NATS, MinIO, Keycloak, PostgreSQL (pour Keycloak)

**Convention de nommage des packages :** `@cook-me/<package-name>`

---

## ⚙️ Prérequis

- Node.js ≥ 20
- pnpm
- Docker + Docker Compose v2 (`docker compose`)
- Make

> ⚠️ **Windows** → WSL2 fortement recommandé. Certaines commandes Make peuvent ne pas fonctionner en natif.

---

## 🧰 Setup initial

```bash
git clone git@github.com:hayamiou/cook-me.git
cd cook-me
pnpm install
```

### Configurer les variables d'environnement

```bash
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
```

Éditez les deux fichiers `.env` selon votre environnement (voir section **Variables d'environnement** ci-dessous).

### Configurer Keycloak

Suivez le guide `KEYCLOAK_SETUP.md` pour créer le realm `cook-me`, les clients `cook-me-api` et `cook-me-mobile`, et un utilisateur de test.

---

## 🚀 Démarrage

### Terminal 1 — Backend (Docker)

```bash
make up        # Démarre toute l'infrastructure
make logs      # Suivre les logs en temps réel
make down      # Arrêter les conteneurs
```

### Terminal 2 — Mobile

```bash
make mobile    # Mode LAN (réseau Wi-Fi classique)
make tunnel    # Mode tunnel (réseau restreint / test sur mobile physique)
```

> 💡 Utilisez `make tunnel` si vous testez sur un téléphone physique hors réseau local — ou si vous avez configuré des tunnels Cloudflare.

---

## 🔐 Variables d'environnement

### `.env` (racine — utilisé par l'API et Docker)

| Variable | Description | Défaut local |
|---|---|---|
| `KEYCLOAK_ISSUER` | URL de l'issuer Keycloak | `http://localhost:8080/realms/cook-me` |
| `KEYCLOAK_CLIENT_ID` | Client ID de l'API | `cook-me-api` |
| `MINIO_USER` | Identifiant MinIO | `minio` |
| `MINIO_PASSWORD` | Mot de passe MinIO | `minioSecret` |
| `MINIO_BUCKET` | Nom du bucket | `cook-me-bucket` |

### `apps/mobile/.env`

| Variable | Description | Défaut local |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL de l'API | `http://localhost:3001` |
| `EXPO_PUBLIC_KEYCLOAK_ISSUER` | URL de l'issuer Keycloak | `http://localhost:8080/realms/cook-me` |
| `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID` | Client ID mobile | `cook-me-mobile` |

> 📱 **Test sur mobile physique** : remplacez les URLs `localhost` par vos URLs Cloudflare (ou l'IP locale de votre machine). Pensez à configurer la **Frontend URL** dans Keycloak (Realm Settings → General).

---

## 🧪 Scripts disponibles

```bash
pnpm build       # Build tous les packages (Turbo)
pnpm typecheck   # Vérification TypeScript
pnpm test        # Tests (Vitest)
pnpm lint        # Lint Biome
pnpm lint:fix    # Lint + auto-fix
```

---

## 🔁 Workflow Git

### Créer une branche

Toujours à partir de `origin/develop` :

```bash
git fetch origin
git switch -c feature/CM-21-description origin/develop
```

### Commiter

```bash
git add .
git commit -S -m "feat(scope): description"
```

### Avant une PR (rebase obligatoire)

```bash
git fetch origin
git rebase origin/develop
git push origin feature/CM-21-description
```

### Règles

- PR vers `develop` uniquement
- Rebase obligatoire avant merge
- Pas de push direct sur `develop`
- Suppression automatique des branches après merge

### Convention des branches

```
feature/CM-21-auth
fix/CM-22-login-bug
chore/update-deps
```

---

## 📝 Conventional Commits (obligatoire)

Format : `type(scope): description`

Types : `feat`, `fix`, `chore`, `refactor`, `docs`, `test`

> Les commits doivent être signés GPG (`git commit -S`).
> Guide : https://formationgit.fr/blog/cles-gpg-et-git-securise-tes-commits-en-5-minutes-chrono

---

## 🧠 Choix techniques

| Outil | Rôle |
|---|---|
| Turborepo | Exécution parallèle + cache intelligent |
| Biome | Lint + format (config centralisée) |
| TypeScript | Approche source-first, pas de pré-build des packages |
| NATS | Messaging entre microservices |
| Keycloak | SSO — Authorization Code + PKCE |
| MinIO | Stockage objet (images recettes) |

---

Happy coding 👩‍🍳👨‍🍳
