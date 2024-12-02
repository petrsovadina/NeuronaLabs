# Makefile pro dynamickou konfiguraci NeuronaLabs projektu

# Proměnné
COMPOSE_FILE = docker-compose.yml
ENV_FILE = .env
SECRETS_DIR = secrets
PROJECT_NAME = neuronalabs

# Výchozí cíl
.DEFAULT_GOAL := help

# Příkazy
help:
	@echo "NeuronaLabs Medical Platform - Dynamická konfigurace"
	@echo ""
	@echo "Použití:"
	@echo "  make setup       - Inicializace projektu a příprava prostředí"
	@echo "  make secrets     - Generování tajných klíčů"
	@echo "  make up          - Spuštění všech služeb"
	@echo "  make down        - Zastavení a odstranění všech kontejnerů"
	@echo "  make restart     - Restart všech služeb"
	@echo "  make logs        - Zobrazení logů všech služeb"
	@echo "  make clean       - Vyčištění Docker prostoru"
	@echo "  make status      - Zobrazení stavu kontejnerů"
	@echo "  make init-secrets - Generování tajných klíčů"
	@echo "  make generate-env - Generování .env souboru"
	@echo "  make start-supabase - Spuštění Supabase"
	@echo "  make start-services - Spuštění služeb Docker Compose"
	@echo "  make stop-all - Zastavení všech služeb"

# Kontrola existence .env souboru
check-env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Chybí konfigurační soubor .env. Vytvořte jej podle .env.example."; \
		cp .env.example .env; \
	fi

# Vytvoření adresáře pro tajné klíče
create-secrets-dir:
	@mkdir -p $(SECRETS_DIR)

# Generování tajných klíčů
secrets: create-secrets-dir
	@echo "Generování tajných klíčů..."
	@openssl rand -base64 32 > $(SECRETS_DIR)/jwt_secret.txt
	@openssl rand -base64 32 > $(SECRETS_DIR)/supabase_service_key.txt
	@echo "Tajné klíče byly vygenerovány."

# Generování tajných klíčů
init-secrets:
	@echo "Generování tajných klíčů..."
	@openssl rand -base64 32 > .jwt_secret
	@openssl rand -base64 32 > .supabase_jwt_secret
	@echo "Tajné klíče byly vygenerovány."

# Generování .env souboru
generate-env:
	@echo "Generování konfigurace prostředí..."
	@cp .env.example .env
	@sed -i '' "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$(shell cat .jwt_secret)|g" .env
	@sed -i '' "s|SUPABASE_JWT_SECRET=.*|SUPABASE_JWT_SECRET=$(shell cat .supabase_jwt_secret)|g" .env
	@echo "Konfigurace prostředí byla vygenerována."

# Inicializace projektu
setup: check-env secrets
	@echo "Inicializace projektu NeuronaLabs..."
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) pull
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) build

# Kompletní inicializace projektu
setup-all: init-secrets generate-env start-supabase start-services

# Spuštění všech služeb
up: check-env secrets
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@echo "Všechny služby byly spuštěny v detached módu."

# Spuštění Supabase
start-supabase:
	@echo "Spouštění Supabase..."
	@supabase start

# Spuštění služeb Docker Compose
start-services:
	@echo "Spouštění služeb projektu..."
	@docker-compose up -d

# Zastavení a odstranění všech kontejnerů
down: check-env
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down
	@echo "Všechny služby byly zastaveny a kontejnery odstraněny."

# Zastavení všech služeb
stop-all:
	@docker-compose down
	@supabase stop

# Restart všech služeb
restart: down up

# Zobrazení logů
logs: check-env
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f

# Vyčištění Docker prostoru
clean:
	@docker-compose -f $(COMPOSE_FILE) down -v
	@docker system prune -f
	@docker volume prune -f
	@rm -rf $(SECRETS_DIR)
	@echo "Docker prostor byl vyčištěn."

# Vyčištění projektu
clean-all:
	@docker-compose down -v
	@supabase stop
	@rm -f .jwt_secret .supabase_jwt_secret .env

# Zobrazení stavu kontejnerů
status:
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) ps

# Migrace databáze
migrate: check-env
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) run --rm backend dotnet ef database update

# Spuštění testů
test: check-env
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) run --rm backend dotnet test

# Konfigurace Supabase
supabase-init:
	@echo "Inicializace Supabase..."
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d supabase-db supabase-auth supabase-studio
	@echo "Supabase služby byly spuštěny."

.PHONY: help setup init-secrets generate-env start-supabase start-services stop-all clean
