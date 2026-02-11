.PHONY: help install up up-d build down logs ps mongo redis api mobile tunnel dev clean

help:
	@echo ""
	@echo "Cook-Me shortcuts:"
	@echo "  make install   Install dependencies (pnpm)"
	@echo "  make up        Start API + Mongo + Redis (BuildKit enabled)"
	@echo "  make up-d      Start in background (detached)"
	@echo "  make build     Build API image (BuildKit enabled)"
	@echo "  make down      Stop containers"
	@echo "  make logs      Follow logs"
	@echo "  make ps        List running containers"
	@echo "  make mobile    Start Expo (LAN, port 8081)"
	@echo "  make tunnel    Start Expo (tunnel, port 8081)"
	@echo "  make dev       Print recommended dev workflow (2 terminals)"
	@echo "  make clean     Stop + remove volumes (DANGER: deletes DB data)"
	@echo ""

install:
	pnpm install

build:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build api

up:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose up

up-d:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

api:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose up api

mongo:
	docker-compose up mongo

redis:
	docker-compose up redis

mobile:
	pnpm --filter @cook-me/mobile dev

tunnel:
	pnpm --filter @cook-me/mobile dev:tunnel

dev:
	@echo "Recommended dev workflow:"
	@echo "  Terminal 1: make up"
	@echo "  Terminal 2: make mobile"
	@echo ""
	@echo "If you need tunnel:"
	@echo "  Terminal 2: make tunnel"

clean:
	docker-compose down -v
