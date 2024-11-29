#!/bin/bash

# Nastavení proměnných prostředí pro lokální vývoj
export ASPNETCORE_ENVIRONMENT=Development
export POSTGRES_DB=neuronalabs
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=yourpassword
export JWT_SECRET=local_development_secret_key_7630b55d7c954cf493283886888427ec
export JWT_ISSUER=http://localhost:5000
export JWT_AUDIENCE=http://localhost:3000
export CORS_ORIGINS=http://localhost:3000

# Zastavení a odstranění existujících kontejnerů
echo "Zastavování existujících kontejnerů..."
docker-compose down

# Vyčištění existujících volumes (volitelné)
echo "Čištění volumes..."
docker volume prune -f

# Sestavení a spuštění kontejnerů
echo "Sestavování a spouštění kontejnerů..."
docker-compose up --build -d

# Čekání na spuštění databáze a migrace
echo "Čekání na inicializaci služeb..."
sleep 10

# Kontrola zdraví služeb
echo "Kontrola stavu služeb..."
curl -f http://localhost:5000/health

echo "Lokální prostředí je připraveno!"
echo "Backend API běží na: http://localhost:5000"
echo "Frontend běží na: http://localhost:3000"
echo "Swagger dokumentace je dostupná na: http://localhost:5000/swagger"
