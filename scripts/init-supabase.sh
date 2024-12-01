#!/bin/bash

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Zastavení běžící instance Supabase
echo -e "${YELLOW}Zastavuji běžící instanci Supabase...${NC}"
supabase stop || true

# Vyčištění starých dat
echo -e "${YELLOW}Mažu stará data...${NC}"
rm -rf ~/.local/share/supabase/data

# Inicializace Supabase projektu
echo -e "${GREEN}Inicializuji Supabase projekt...${NC}"
supabase init || true

# Start lokálního Supabase
echo -e "${GREEN}Spouštím lokální Supabase...${NC}"
supabase start

# Aplikace migrací
echo -e "${GREEN}Aplikuji migrace...${NC}"
supabase db reset

# Generování TypeScript typů
echo -e "${GREEN}Generuji TypeScript typy...${NC}"
mkdir -p ./frontend/types
supabase gen types typescript --local > ./frontend/types/supabase.ts

echo -e "\n${GREEN}Inicializace dokončena!${NC}"
echo -e "Supabase běží na http://localhost:54323"
echo -e "Studio je dostupné na http://localhost:54323/studio"
echo -e "Databáze běží na http://localhost:54322"
echo -e "\nPro přihlášení do Supabase Studio použijte:"
echo -e "Email: admin@admin.cz"
echo -e "Heslo: admin123456"
