# Průvodce nasazením NeuronaLabs

Tento dokument poskytuje podrobný návod pro nasazení NeuronaLabs platformy.

## Předpoklady

### Minimální požadavky na server
- CPU: 4 jádra
- RAM: 8 GB
- Disk: 50 GB SSD
- OS: Ubuntu 20.04 LTS nebo novější

### Požadované verze software
- Docker: 20.10.x nebo novější
- Docker Compose: 2.x
- .NET SDK: 6.0.100 nebo novější
- Node.js: 16.20.0 nebo novější
- PostgreSQL: 13.x nebo novější

## Krok 1: Příprava serveru

```bash
# Aktualizace systému
sudo apt update && sudo apt upgrade -y

# Instalace základních nástrojů
sudo apt install -y curl git wget unzip

# Instalace Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalace Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Krok 2: Klonování repozitáře

```bash
# Klonování repozitáře
git clone https://github.com/your-org/neuronalabs.git
cd neuronalabs

# Kopírování a úprava konfigurace
cp .env.example .env
nano .env  # Upravte podle potřeby
```

## Krok 3: Konfigurace prostředí

V souboru `.env` nastavte následující proměnné:

```bash
# Databáze
POSTGRES_USER=neuronalabs
POSTGRES_PASSWORD=<silné-heslo>
POSTGRES_DB=neuronalabs

# Backend
ASPNETCORE_ENVIRONMENT=Production
JWT_SECRET=<tajný-klíč>
CORS_ORIGINS=https://vase-domena.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.vase-domena.com
```

## Krok 4: SSL certifikáty

```bash
# Instalace Certbot
sudo apt install -y certbot

# Získání certifikátu
sudo certbot certonly --standalone -d api.vase-domena.com
sudo certbot certonly --standalone -d vase-domena.com
```

## Krok 5: Nasazení aplikace

```bash
# Build a spuštění kontejnerů
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Kontrola logů
docker-compose -f docker-compose.prod.yml logs -f
```

## Krok 6: Inicializace databáze

```bash
# Spuštění migrace
docker-compose -f docker-compose.prod.yml exec backend dotnet ef database update
```

## Krok 7: Kontrola nasazení

1. Zkontrolujte dostupnost služeb:
   - Frontend: https://vase-domena.com
   - Backend API: https://api.vase-domena.com
   - GraphQL Playground: https://api.vase-domena.com/graphql

2. Zkontrolujte logy:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

3. Zkontrolujte health endpointy:
```bash
curl https://api.vase-domena.com/health
```

## Řešení problémů

### 1. Databázové spojení
Pokud se backend nemůže připojit k databázi:
```bash
# Kontrola běhu databáze
docker-compose -f docker-compose.prod.yml ps
# Kontrola logů databáze
docker-compose -f docker-compose.prod.yml logs db
```

### 2. Frontend není dostupný
```bash
# Kontrola build logů
docker-compose -f docker-compose.prod.yml logs frontend
# Rebuild frontend kontejneru
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

### 3. Backend API nefunguje
```bash
# Kontrola logů
docker-compose -f docker-compose.prod.yml logs backend
# Restart backend služby
docker-compose -f docker-compose.prod.yml restart backend
```

## Monitoring

1. Kontrola využití zdrojů:
```bash
docker stats
```

2. Kontrola disků:
```bash
df -h
```

3. Kontrola logů:
```bash
# Všechny logy
docker-compose -f docker-compose.prod.yml logs

# Specifická služba
docker-compose -f docker-compose.prod.yml logs [service]
```

## Zálohování

1. Databáze:
```bash
# Vytvoření zálohy
docker-compose -f docker-compose.prod.yml exec db pg_dump -U neuronalabs > backup.sql

# Obnovení ze zálohy
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U neuronalabs
```

2. Soubory:
```bash
# Záloha uploads adresáře
tar -czf uploads-backup.tar.gz ./uploads
```

## Aktualizace aplikace

1. Stažení nových změn:
```bash
git pull origin main
```

2. Rebuild a restart služeb:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

3. Kontrola migrace databáze:
```bash
docker-compose -f docker-compose.prod.yml exec backend dotnet ef database update
```

## Bezpečnostní doporučení

1. Pravidelná aktualizace:
```bash
# Aktualizace systému
sudo apt update && sudo apt upgrade -y

# Aktualizace Docker image
docker-compose -f docker-compose.prod.yml pull
```

2. Kontrola logů:
```bash
# Kontrola auth logů
sudo tail -f /var/log/auth.log
```

3. Firewall:
```bash
# Povolení pouze potřebných portů
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Kontakty pro podporu

- Technická podpora: support@neuronalabs.com
- Bezpečnostní incidenty: security@neuronalabs.com
- Dokumentace: https://docs.neuronalabs.com
