.PHONY: up down build install fresh migrate seed shell npm-dev npm-build

# Start all containers
up:
	docker compose up -d

# Stop all containers
down:
	docker compose down

# Build/rebuild containers
build:
	docker compose build --no-cache

# Full install (first time setup)
install: build up
	docker compose exec app composer install
	docker compose exec app php artisan key:generate
	docker compose exec app php artisan migrate
	docker compose exec app npm install
	@echo "Done! App running at http://localhost:8080"
	@echo "phpMyAdmin at http://localhost:8081"

# Fresh migration + seed
fresh:
	docker compose exec app php artisan migrate:fresh --seed

# Run migration
migrate:
	docker compose exec app php artisan migrate

# Run seeder
seed:
	docker compose exec app php artisan db:seed

# Shell into app container
shell:
	docker compose exec app bash

# Run Vite dev server
npm-dev:
	docker compose exec app npm run dev

# Build assets for production
npm-build:
	docker compose exec app npm run build

# Run artisan commands (usage: make artisan cmd="route:list")
artisan:
	docker compose exec app php artisan $(cmd)

# Run composer commands (usage: make composer cmd="require package/name")
composer:
	docker compose exec app composer $(cmd)
