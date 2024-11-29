#!/bin/bash

echo "Kontrola verzí a závislostí NeuronaLabs"
echo "======================================="

# Kontrola Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✓ Docker: $DOCKER_VERSION"
else
    echo "✗ Docker není nainstalován"
    exit 1
fi

# Kontrola Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo "✓ Docker Compose: $COMPOSE_VERSION"
else
    echo "✗ Docker Compose není nainstalován"
    exit 1
fi

# Kontrola .NET
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    if [[ "$DOTNET_VERSION" == 8.* ]]; then
        echo "✓ .NET SDK: $DOTNET_VERSION"
    else
        echo "✗ .NET SDK: Požadována verze 8.x, nalezena verze $DOTNET_VERSION"
        exit 1
    fi
else
    echo "✗ .NET SDK není nainstalován"
    exit 1
fi

# Kontrola Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ "$NODE_VERSION" == v23.* ]]; then
        echo "✓ Node.js: $NODE_VERSION"
    else
        echo "✗ Node.js: Požadována verze 23.x, nalezena verze $NODE_VERSION"
        exit 1
    fi
else
    echo "✗ Node.js není nainstalován"
    exit 1
fi

# Kontrola npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm: $NPM_VERSION"
else
    echo "✗ npm není nainstalován"
    exit 1
fi

# Kontrola PostgreSQL klienta
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo "✓ PostgreSQL klient: $PSQL_VERSION"
else
    echo "✗ PostgreSQL klient není nainstalován"
    exit 1
fi

# Kontrola konfiguračních souborů
echo -e "\nKontrola konfiguračních souborů:"
echo "================================"

if [ -f ".env" ]; then
    echo "✓ .env soubor existuje"
else
    echo "✗ .env soubor chybí (zkopírujte .env.example do .env)"
fi

if [ -f "docker-compose.yml" ]; then
    echo "✓ docker-compose.yml existuje"
else
    echo "✗ docker-compose.yml chybí"
fi

if [ -f "backend/global.json" ]; then
    echo "✓ backend/global.json existuje"
else
    echo "✗ backend/global.json chybí"
fi

if [ -f "frontend/.nvmrc" ]; then
    echo "✓ frontend/.nvmrc existuje"
else
    echo "✗ frontend/.nvmrc chybí"
fi

# Kontrola oprávnění
echo -e "\nKontrola oprávnění:"
echo "==================="

if [ -w "uploads" ]; then
    echo "✓ Adresář uploads je zapisovatelný"
else
    echo "✗ Adresář uploads není zapisovatelný"
fi

if [ -x "scripts" ]; then
    echo "✓ Adresář scripts je spustitelný"
else
    echo "✗ Adresář scripts není spustitelný"
fi

echo -e "\nKontrola dokončena!"
