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
- .NET 6.0
- GraphQL (HotChocolate)
- PostgreSQL
- Entity Framework Core
- Supabase

### Frontend
- React.js
- OHIF Viewer
- Tailwind CSS
- GraphQL Client

### Infrastruktura
- Docker + Docker Compose
- Nginx
- PostgreSQL

## Požadavky

- .NET 8.0 SDK
- Node.js 23+
- Docker
- PostgreSQL 13+

## Rychlý start

1. Klonování repozitáře:
```bash
git clone https://github.com/your-org/neuronalabs.git
cd neuronalabs
```

2. Nastavení prostředí:
```bash
cp .env.example .env
# Upravte .env soubor podle vašich potřeb
```

3. Spuštění aplikace:
```bash
docker-compose up
```

Aplikace bude dostupná na:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- GraphQL Playground: http://localhost:5000/graphql

## Struktura projektu

```
├── backend/             # .NET Core backend
├── frontend/           # React/Next.js frontend
├── docs/              # Dokumentace
├── scripts/           # Pomocné skripty
└── docker/            # Docker konfigurace
```

## Bezpečnost

- JWT autentizace
- HTTPS/SSL
- Role-based access control
- Šifrování citlivých dat
- Pravidelné security audity

## Monitoring

- Application Insights
- Error tracking (Sentry)
- Performance monitoring
- Health checks

## Deployment

Detailní instrukce pro deployment jsou v `docs/deployment.md`

## Testování

```bash
# Backend testy
cd backend
dotnet test

# Frontend testy
cd frontend
npm test
```

## Dokumentace

- [Architektura](docs/architecture.md)
- [Vývoj](docs/development.md)
- [Nasazení](docs/deployment.md)
- [Bezpečnost](docs/security.md)
- API dokumentace

## Přispívání

Viz `CONTRIBUTING.md` pro detaily jak přispívat do projektu.

## Licence

Copyright 2023 NeuronaLabs
