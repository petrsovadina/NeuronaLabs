#!/bin/bash

# Kontrola, zda je Docker nainstalován
if ! command -v docker &> /dev/null; then
    echo "Docker není nainstalován. Prosím nainstalujte Docker před pokračováním."
    exit 1
fi

# Kontrola, zda je Docker Compose nainstalován
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose není nainstalován. Prosím nainstalujte Docker Compose před pokračováním."
    exit 1
fi

# Načtení proměnných prostředí
if [ -f ../.env ]; then
    source ../.env
else
    echo "Soubor .env nebyl nalezen. Prosím vytvořte .env soubor podle vzoru .env.example"
    exit 1
fi

# Kontrola existence důležitých proměnných
required_vars=(
    "POSTGRES_DB"
    "POSTGRES_USER"
    "POSTGRES_PASSWORD"
    "JWT_SECRET"
    "API_URL"
    "CORS_ORIGINS"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Chybí proměnná $var v .env souboru"
        exit 1
    fi
done

echo "Spouštím nasazení NeuronaLabs..."

# Přejít do kořenového adresáře projektu
cd ..

# Zastavit běžící kontejnery
echo "Zastavuji běžící kontejnery..."
docker-compose down

# Vyčistit Docker cache pro čistou instalaci
echo "Čistím Docker cache..."
docker system prune -f

# Sestavit a spustit kontejnery
echo "Sestavuji a spouštím kontejnery..."
docker-compose up -d --build

# Kontrola stavu služeb
echo "Kontroluji stav služeb..."
sleep 10

services=("db" "backend" "frontend")
for service in "${services[@]}"; do
    status=$(docker-compose ps -q $service)
    if [ -z "$status" ]; then
        echo "Služba $service se nespustila správně"
        docker-compose logs $service
        exit 1
    fi
done

echo "Kontroluji health checks..."
for service in "${services[@]}"; do
    attempts=0
    max_attempts=30
    while [ $attempts -lt $max_attempts ]; do
        if docker-compose ps $service | grep -q "healthy"; then
            echo "Služba $service je připravena"
            break
        fi
        attempts=$((attempts + 1))
        echo "Čekám na službu $service... pokus $attempts z $max_attempts"
        sleep 5
    done
    if [ $attempts -eq $max_attempts ]; then
        echo "Služba $service není zdravá po $max_attempts pokusech"
        docker-compose logs $service
        exit 1
    fi
done

echo "Nasazení bylo úspěšně dokončeno!"
echo "API je dostupné na: $API_URL"
echo "Frontend je dostupný na: http://localhost:3000"
