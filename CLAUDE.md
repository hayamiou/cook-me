# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cook-Me** is a full-stack monorepo for a recipe app with:
- `apps/api` — NestJS REST API (port 3001, Dockerized)
- `apps/mobile` — Expo/React Native mobile app
- `apps/aiworker` — AI worker microservice (NestJS)
- `apps/enricher` — Data enrichment microservice (NestJS)
- `packages/` — Shared TypeScript packages (`schemas`, `shared-utils`, `ms-utils`, `tsconfig`)

Infrastructure (Docker Compose): MongoDB, Redis, NATS, MinIO, Keycloak, PostgreSQL (for Keycloak).

## Commands

### Development

```bash
make up          # Start Docker infrastructure (detached)
make logs        # Follow Docker logs
make mobile      # Start Expo in LAN mode (port 8081)
make tunnel      # Start Expo via tunnel (restricted networks)
make down        # Stop Docker containers
make clean       # Stop + remove volumes (deletes all data)
```

### pnpm (from monorepo root)

```bash
pnpm install     # Install all dependencies
pnpm dev         # Full stack (Docker + mobile concurrently)
pnpm build       # Build all packages (Turbo)
pnpm typecheck   # Type-check all packages
pnpm lint        # Biome lint
pnpm lint:fix    # Auto-fix lint issues
pnpm test        # Run all tests (Vitest)
```

### Tests (from `apps/api` or other app dirs)

```bash
pnpm test            # Run all tests once
pnpm test:watch      # Watch mode
pnpm test:cov        # Coverage report
```

To run a single test file:
```bash
pnpm vitest run src/recipes/recipes.service.spec.ts
```

## Code Style

Linter/formatter: **Biome** (`biome.json` at root).
- 2-space indentation, 100-char line width, LF line endings
- Single quotes, trailing commas, no semicolons
- Run `pnpm lint:fix` to auto-format

Commit messages must follow **Conventional Commits** (enforced by commitlint + Husky):
- Format: `type(scope): description`
- Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- GPG signing required: `git commit -S`

## Architecture

### Backend (NestJS API)

- **Auth**: Keycloak SSO with RS256 JWTs validated via JWKS. `JwtAuthGuard` is global; use `@Public()` to exempt routes, `@CurrentUser()` to inject user data.
- **Modules**: `RecipesModule`, `IngredientsModule` follow the pattern: Controller → Service → Repository → Mongoose Schema.
- **Microservices**: NATS transport (`nats://nats:4222`) for inter-service events. Event types/patterns defined in `@cook-me/ms-utils`.
- **Rate limiting**: 10 requests / 60s per route via `ThrottlerGuard`.

### Mobile (Expo/React Native)

- **Routing**: Expo Router (file-based, in `app/` directory).
- **Styling**: NativeWind (Tailwind CSS for React Native).
- **State**: React Context — `AuthContext` (Keycloak auth state), `CartContext`, `RecipesContext`.

### Shared Packages

- `@cook-me/schemas` — DTOs, entity types, `WithObjectId` utility for MongoDB.
- `@cook-me/ms-utils` — Zod-validated NATS event schemas and type-safe client proxy.
- `@cook-me/shared-utils` — Dual ESM/CJS utility functions.

### Data Model

**Recipe** (MongoDB/Mongoose): `name`, `idCreator` (Keycloak user ID), `category` (enum), `ingredients` (array of `{ingredient: ObjectId, quantity: number}`), `steps`, `imageKey` (MinIO), `isLiked`, timestamps.

**Ingredient**: `title`, `unit` (enum: grammes, litres, cuillere_a_soupe, cuillere_a_cafe, sans).

## Environment

Copy `.env.example` to `.env` and configure:
- `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID` for auth
- MinIO credentials and bucket name
- See `KEYCLOAK_SETUP.md` for Keycloak realm/client setup steps

Test user (local dev): `testuser` / `password123`

## Git Workflow

- Branch from `develop`: `git switch -c feature/CM-XX-description origin/develop`
- Rebase before PR: `git rebase origin/develop`
- PRs merge into `develop` using rebase strategy
- Windows: use WSL2 (strongly recommended)
