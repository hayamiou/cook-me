.PHONY: help install up up-d build down logs ps mongo redis nats keycloak api mobile tunnel dev seed reset-db clean

help:
	@echo ""
	@echo "Cook-Me shortcuts:"
	@echo "  make install    Install dependencies (pnpm)"
	@echo ""
	@echo "  make up         Start all services (BuildKit enabled)"
	@echo "  make up-d       Start in background (detached)"
	@echo "  make build      Build all app images (BuildKit enabled)"
	@echo "  make down       Stop all containers"
	@echo "  make logs       Follow logs (all services)"
	@echo "  make ps         List running containers"
	@echo "  make clean      Stop + remove volumes (DANGER: deletes all data)"
	@echo "  make seed       Clear and re-insert seed data into MongoDB (Keycloak untouched)"
	@echo "  make reset-db   Wipe and recreate MongoDB volume only (Keycloak untouched)"
	@echo ""
	@echo "  make api        Start API only"
	@echo "  make keycloak   Start Keycloak + PostgreSQL only"
	@echo "  make mongo      Start MongoDB only"
	@echo "  make redis      Start Redis only"
	@echo "  make nats       Start NATS only"
	@echo ""
	@echo "  make mobile     Start Expo (LAN, port 8081)"
	@echo "  make tunnel     Start Expo (tunnel — for physical devices / restricted networks)"
	@echo "  make dev        Print recommended dev workflow"
	@echo ""

install:
	pnpm install

build:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose build

up:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose up

up-d:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

api:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker compose up api

keycloak:
	docker compose up keycloak postgres-keycloak

mongo:
	docker compose up mongo

redis:
	docker compose up redis

nats:
	docker compose up nats

mobile:
	pnpm --filter @cook-me/mobile dev

tunnel:
	pnpm --filter @cook-me/mobile dev:tunnel

dev:
	@echo ""
	@echo "Recommended dev workflow:"
	@echo ""
	@echo "  1. Copy and fill in your .env files:"
	@echo "       cp .env.example .env"
	@echo "       cp apps/mobile/.env.example apps/mobile/.env"
	@echo ""
	@echo "  2. Terminal 1 — Backend:"
	@echo "       make up"
	@echo ""
	@echo "  3. Configure Keycloak (first time only):"
	@echo "       See KEYCLOAK_SETUP.md"
	@echo ""
	@echo "  4. Terminal 2 — Mobile:"
	@echo "       make mobile      (LAN — same Wi-Fi)"
	@echo "       make tunnel      (physical device / restricted network)"
	@echo ""

seed:
	docker exec -i mongo mongosh CMDB --eval "db.ingredients.deleteMany({}); db.recipes.deleteMany({})"
	docker cp scripts/mongo-init.js mongo:/tmp/seed.js
	docker exec -i mongo mongosh CMDB /tmp/seed.js

reset-db:
	docker compose stop mongo
	docker volume rm $$(docker volume ls -q | grep mongo-data) 2>/dev/null || true
	docker compose up -d mongo
	@echo "⏳ MongoDB redémarre, seed auto via /docker-entrypoint-initdb.d/..."

clean:
	docker compose down -v
