# NeuronaLabs Healthcare Platform

Platforma pro správu zdravotnických dat a DICOM snímků.

## Funkce

- Správa pacientů a jejich zdravotních záznamů
- DICOM prohlížeč (OHIF Viewer)
- Diagnostická data management
- GraphQL API
- Zabezpečený přístup a správa uživatelů

## Technický Stack

### Backend
- .NET 8.0
- GraphQL (HotChocolate)
- Supabase (Auth, Storage, Realtime)
- PostgreSQL

### Frontend
- Next.js 14
- OHIF Viewer v3
- Tailwind CSS
- GraphQL (Apollo Client)
- Supabase JS Client

### Infrastruktura
- Docker + Docker Compose
- Supabase Platform
- Vercel (Frontend)

## Požadavky

- .NET 8.0 SDK
- Node.js 18+ a npm
- Docker Desktop
- Supabase CLI
- Git

## Rychlý start

1. Klonování repozitáře:
```bash
git clone https://github.com/your-org/neuronalabs.git
cd neuronalabs
```

2. Instalace Supabase CLI (pokud není nainstalováno):
```bash
# macOS
brew install supabase/tap/supabase

# Windows (přes scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

3. Nastavení prostředí:
```bash
cp .env.example .env
# Upravte .env soubor s vašimi Supabase credentials
```

4. Inicializace Supabase projektu:
```bash
./scripts/init-supabase.sh
```

5. Spuštění aplikace:
```bash
# Backend
cd backend
dotnet run

# Frontend (v novém terminálu)
cd frontend
npm install
npm run dev
```

Aplikace bude dostupná na:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- GraphQL Playground: http://localhost:5000/graphql
- Supabase Studio: http://localhost:54323/studio

## Struktura projektu

```
├── backend/           # .NET Backend
│   ├── GraphQL/      # GraphQL schéma a resolvery
│   ├── Models/       # Doménové modely
│   └── Services/     # Byznys logika a služby
├── frontend/         # Next.js Frontend
│   ├── app/         # Next.js 14 App Router
│   ├── components/  # React komponenty
│   └── lib/         # Sdílené utility
├── supabase/        # Supabase konfigurace
│   ├── migrations/  # SQL migrace
│   └── seed.sql     # Testovací data
└── scripts/         # Pomocné skripty
```

## Supabase Setup

### Lokální vývoj

1. Spuštění lokálního Supabase:
```bash
supabase start
```

2. Aplikace migrací:
```bash
supabase db reset
```

3. Generování TypeScript typů:
```bash
supabase gen types typescript --local > ./frontend/types/supabase.ts
```

### Produkční nasazení

1. Vytvoření nového projektu na Supabase:
```bash
supabase link --project-ref <project-id>
```

2. Push schématu do produkce:
```bash
supabase db push
```

## Autentizace a Bezpečnost

- JWT autentizace přes Supabase Auth
- Row Level Security (RLS) policies
- RBAC (Role-Based Access Control)
- Šifrování citlivých dat
- Audit logy

## Vývoj

### Backend

1. Spuštění API:
```bash
cd backend
dotnet watch run
```

2. Přístup ke GraphQL Playground:
- http://localhost:5000/graphql

### Frontend

1. Spuštění vývojového serveru:
```bash
cd frontend
npm run dev
```

2. Build pro produkci:
```bash
npm run build
npm start
```

## Testování

```bash
# Backend testy
cd backend
dotnet test

# Frontend testy
cd frontend
npm test
```

## Deployment

### Frontend (Vercel)

1. Push do GitHub
2. Propojení s Vercel
3. Nastavení environment variables

### Backend

Detailní instrukce v `docs/deployment.md`

## Řešení problémů

### Reset lokálního prostředí

```bash
# Stop a reset Supabase
supabase stop
supabase start --reset

# Reset databáze
supabase db reset
```

### Logy

```bash
# Supabase logy
supabase logs

# Backend logy
dotnet run --launch-profile Development

# Frontend logy
npm run dev
```

## Dokumentace

- [Architektura](docs/architecture.md)
- [API Reference](docs/api.md)
- [Supabase Schema](docs/schema.md)
- [Security](docs/security.md)

## Příspěvky

Viz [CONTRIBUTING.md](CONTRIBUTING.md)

## Licence

MIT
