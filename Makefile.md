```makefile
.PHONY: docker-up docker-down docker-rebuild docker-rebuild-nocache docker-logs docker-ps docker-clean

## Start containers
docker-up:
	docker compose up

## Stop containers
docker-down:
	docker compose down

## Rebuild containers after Dockerfile changes (recommended)
docker-rebuild:
	docker compose down
	docker compose up --build

## Rebuild without cache (if Docker behaves strangely)
docker-rebuild-nocache:
	docker compose down
	docker compose build --no-cache
	docker compose up

## Follow container logs
docker-logs:
	docker compose logs -f

## List running containers
docker-ps:
	docker ps

## Clean dangling images only (safe)
docker-clean:
	docker image prune -f