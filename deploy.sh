#!/bin/bash

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Nasazení NeuronaLabs${NC}"
echo "===================="

# 1. Kontrola předpokladů
echo -e "\n${YELLOW}1. Kontrola předpokladů${NC}"
if ! ./version-check.sh; then
    echo -e "${RED}Kontrola předpokladů selhala${NC}"
    exit 1
fi

# 2. Příprava prostředí
echo -e "\n${YELLOW}2. Příprava prostředí${NC}"

if [ ! -f ".env" ]; then
    echo "Kopíruji .env.example do .env"
    cp .env.example .env
    echo -e "${YELLOW}Prosím upravte .env soubor podle vašich potřeb a spusťte skript znovu${NC}"
    exit 1
fi

# 3. Build aplikace
echo -e "\n${YELLOW}3. Build aplikace${NC}"

echo "Zastavuji běžící kontejnery..."
docker-compose down

echo "Building Docker images..."
if ! docker-compose build; then
    echo -e "${RED}Build selhal${NC}"
    exit 1
fi

# 4. Spuštění databáze a čekání na její připravenost
echo -e "\n${YELLOW}4. Spouštění databáze${NC}"
docker-compose up -d db
echo "Čekání na připravenost databáze..."
sleep 10

# 5. Aplikace databázových migrací
echo -e "\n${YELLOW}5. Aplikace databázových migrací${NC}"
if ! docker-compose run --rm backend dotnet ef database update; then
    echo -e "${RED}Migrace selhala${NC}"
    exit 1
fi

# 6. Spuštění aplikace
echo -e "\n${YELLOW}6. Spouštění aplikace${NC}"
if ! docker-compose up -d; then
    echo -e "${RED}Spuštění aplikace selhalo${NC}"
    exit 1
fi

# 7. Kontrola health endpointů
echo -e "\n${YELLOW}7. Kontrola health endpointů${NC}"
echo "Čekání na nastartování služeb..."
sleep 10

if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API je dostupné${NC}"
else
    echo -e "${RED}✗ Backend API není dostupné${NC}"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend je dostupný${NC}"
else
    echo -e "${RED}✗ Frontend není dostupný${NC}"
fi

# 8. Výpis informací o nasazení
echo -e "\n${GREEN}Nasazení dokončeno!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:5000"
echo -e "GraphQL Playground: http://localhost:5000/graphql"

echo -e "\n${YELLOW}Pro zobrazení logů použijte:${NC}"
echo "docker-compose logs -f"

echo -e "\n${YELLOW}Pro zastavení aplikace použijte:${NC}"
echo "docker-compose down"
