# NeuronaLabs - Architektonický Návrh

## 🏗 Architektura Systému

### Celková Architektura
- **Typ**: Mikroslužby
- **Architektonický Vzor**: Čistá architektura (Clean Architecture)
- **Komunikační Protokol**: GraphQL

### Backend (.NET Core 8)
#### Hlavní Komponenty
- **Doménová Vrstva**
  - Entity: Patient, DicomStudy, Diagnosis
  - Validátory
  - Rozhraní repozitářů

- **Aplikační Vrstva**
  - GraphQL Resolvers
  - Autentizační služby
  - DICOM procesní služby

- **Infrastrukturní Vrstva**
  - Entity Framework Core
  - Dependency Injection
  - Autentizace a Autorizace

### Frontend (Next.js 15)
- **Architektura**
  - Server-Side Rendering
  - Statická generace stránek
  - Oddělené komponenty

- **Klíčové Komponenty**
  - OHIF DICOM Viewer
  - Autentizační formuláře
  - Tabulky pacientů
  - Detailní pohledy

### Datová Vrstva
- **Databáze**: PostgreSQL (Supabase)
- **ORM**: Entity Framework Core
- **Migrace**: Supabase migrace
- **Ukládání DICOM**: Orthanc DICOM Server

### Bezpečnostní Vrstva
- JWT Autentizace
- Role-based Access Control
- Šifrování citlivých dat
- HTTPS/TLS

## 🔗 Integrace Služeb

### DICOM Workflow
1. Upload DICOM souboru
2. Extrakce metadat
3. Uložení do Orthanc
4. Indexace v databázi
5. Zobrazení přes OHIF Viewer

### Autentizační Tok
1. Registrace uživatele
2. Generování JWT tokenu
3. Ověření role
4. Přístup k chráněným zdrojům

## 📊 Škálovatelnost
- Horizontální škálování
- Mikroslužby v Kubernetes
- Podpora load balancingu
- Cachování dat

## 🔍 Monitoring
- Prometheus metriky
- Grafana dashboardy
- Centralizované logování
- Zdravotní kontroly služeb

## 🚀 Nasazení
- Kontejnerizace (Docker)
- Orchestrace (Kubernetes)
- CI/CD (GitHub Actions)
- Automatizované testování

## 💡 Klíčové Principy
- Oddělení zodpovědností
- Dependency Injection
- Typová bezpečnost
- Minimalizace technického dluhu
- Flexibilita a rozšiřitelnost
