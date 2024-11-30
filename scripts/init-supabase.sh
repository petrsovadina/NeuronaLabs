#!/bin/bash

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Inicializace Supabase projektu pro NeuronaLabs${NC}\n"

# Kontrola instalace Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI není nainstalováno. Instaluji...${NC}"
    brew install supabase/tap/supabase
fi

# Kontrola existence .env souboru
if [ ! -f .env ]; then
    echo -e "${YELLOW}Vytvářím .env soubor...${NC}"
    cp .env.example .env
    echo "Prosím vyplňte hodnoty v .env souboru"
fi

# Inicializace Supabase projektu
echo -e "${GREEN}Inicializuji Supabase projekt...${NC}"
supabase init

# Start lokálního Supabase
echo -e "${GREEN}Spouštím lokální Supabase...${NC}"
supabase start

# Aplikace migrací
echo -e "${GREEN}Aplikuji migrace...${NC}"
supabase db reset

# Generování TypeScript typů
echo -e "${GREEN}Generuji TypeScript typy...${NC}"
supabase gen types typescript --local > ./frontend/types/supabase.ts

echo -e "\n${GREEN}Inicializace dokončena!${NC}"
echo -e "Můžete začít používat Supabase na http://localhost:54323"
echo -e "Studio je dostupné na http://localhost:54323/studio"
