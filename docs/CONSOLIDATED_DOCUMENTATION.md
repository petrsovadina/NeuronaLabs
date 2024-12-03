# NeuronaLabs GraphQL API Dokumentace

## 🚀 Úvod
Tato dokumentace popisuje GraphQL API pro NeuronaLabs Healthcare Platform.

## 🔐 Autentizace
Všechny dotazy vyžadují platný JWT token v hlavičce `Authorization`.

### Autentizační Schéma
```graphql
type AuthResult {
  token: String!
  user: User!
  expiresAt: DateTime!
}

mutation {
  login(email: String!, password: String!): AuthResult
  register(input: UserRegistrationInput!): AuthResult
}
```

## 📋 Pacienti

### Dotazy
```graphql
# Načtení seznamu pacientů
query GetPatients(
  $search: String, 
  $offset: Int, 
  $limit: Int, 
  $orderBy: PatientOrderBy
): [Patient]

# Detail pacienta
query GetPatient($id: ID!): Patient
```

### Mutace
```graphql
# Vytvoření pacienta
mutation CreatePatient(input: CreatePatientInput!): Patient

# Aktualizace pacienta
mutation UpdatePatient(id: ID!, input: UpdatePatientInput!): Patient

# Smazání pacienta
mutation DeletePatient(id: ID!): Boolean
```

## 🩺 DICOM Studie

### Dotazy
```graphql
# Načtení DICOM studií
query GetDicomStudies(
  $patientId: ID, 
  $modality: Modality, 
  $status: StudyStatus,
  $fromDate: DateTime,
  $toDate: DateTime
): [DicomStudy]

# Detail DICOM studie
query GetDicomStudy($id: ID!): DicomStudy
```

### Mutace
```graphql
# Nahrání DICOM studie
mutation UploadDicomStudy(
  $patientId: ID!
  $dicomFile: Upload!
  $studyDescription: String
  $modality: Modality!
): DicomStudy

# Smazání DICOM studie
mutation DeleteDicomStudy($studyId: ID!): Boolean
```

## 📊 Diagnózy

### Dotazy
```graphql
# Načtení diagnóz pacienta
query GetPatientDiagnoses($patientId: ID!): [Diagnosis]
```

### Mutace
```graphql
# Vytvoření diagnózy
mutation CreateDiagnosis(input: CreateDiagnosisInput!): Diagnosis
```

## 🔍 Příklady

### Načtení pacientů
```graphql
query {
  patients(search: "Novák", limit: 10) {
    id
    firstName
    lastName
    birthDate
    diagnoses {
      id
      diagnosisText
      diagnosisDate
    }
  }
}
```

### Nahrání DICOM studie
```graphql
mutation {
  uploadDicomStudy(
    patientId: "123e4567-e89b-12d3-a456-426614174000"
    dicomFile: $file
    studyDescription: "MRI Brain Scan"
    modality: MRI
  ) {
    id
    orthancServerId
    studyDate
    modality
  }
}
```

## 🛡️ Chybové Stavy
- `UNAUTHORIZED`: Chyba autentizace
- `FORBIDDEN`: Nedostatečná oprávnění
- `NOT_FOUND`: Zdroj nenalezen
- `VALIDATION_ERROR`: Chyba validace dat

## 📦 Verze API
- Aktuální verze: 1.0.0
- Podpora: GraphQL v15
- Minimální požadovaná verze: HotChocolate 13.0.0

## 🌐 Endpointy
- Produkční GraphQL: `/graphql`
- GraphQL Playground: `/graphql/playground`
- GraphQL Dokumentace: `/graphql/docs`
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
# 🏥 NeuronaLabs Healthcare Platform - Komplexní Implementační Specifikace

## 🎯 PROJEKTOVÝ CÍL
Vytvořit komplexní aplikaci pro správu zdravotnických dat s pokročilou DICOM integrací, která umožňuje:
- Správu pacientských záznamů
- Ukládání a zobrazování lékařských snímků
- Bezpečnou autentizaci
- Intuitivní prohlížení zdravotních dat

## 🔧 TECHNOLOGICKÝ STACK

### Backend
- **Jazyk**: .NET Core 8
- **GraphQL Server**: HotChocolate
- **ORM**: Entity Framework Core
- **Databáze**: Supabase PostgreSQL
- **DICOM Server**: Orthanc
- **Autentizace**: JWT Bearer

### Frontend
- **Framework**: Next.js 15
- **Jazyk**: TypeScript
- **UI Knihovna**: Shadcn/UI
- **Styling**: Tailwind CSS
- **DICOM Viewer**: OHIF Viewer
- **State Management**: React Query

## 📋 DETAILNÍ IMPLEMENTAČNÍ PLÁN

### 1. PŘÍPRAVNÁ FÁZE
#### 1.1 Projektová Příprava
- [ ] Definovat přesné projektové požadavky
- [ ] Vytvořit detailní technickou specifikaci
- [ ] Schválit finální technologický stack
- [ ] Nastavit vývojové prostředí

#### 1.2 Nástroje a Konfigurace
- [ ] Instalace .NET 8 SDK
- [ ] Instalace Node.js 18+
- [ ] Konfigurace vývojového prostředí
- [ ] Nastavení Git repozitáře
- [ ] Konfigurace CI/CD

### 2. BACKEND IMPLEMENTACE

#### 2.1 Doménové Modely
- [ ] Vytvořit entitu `Patient`
  - Atributy: ID, jméno, příjmení, datum narození, pohlaví, kontaktní informace
- [ ] Vytvořit entitu `DicomStudy`
  - Atributy: ID, pacient, typ studie, datum, metadata, cesta k souboru
- [ ] Vytvořit entitu `Diagnosis`
  - Atributy: ID, pacient, datum, popis, lékař, typ diagnózy

#### 2.2 GraphQL API
##### Queries
- [ ] `getPatients`: Načtení seznamu pacientů s filtrací a stránkováním
- [ ] `getPatientById`: Detailní informace o pacientovi včetně diagnóz
- [ ] `getDicomStudiesByPatient`: DICOM studie konkrétního pacienta

##### Mutations
- [ ] `createPatient`: Přidání nového pacienta
- [ ] `updatePatientInfo`: Aktualizace osobních údajů pacienta
- [ ] `addDiagnosis`: Přidání nové diagnózy pacientovi
- [ ] `uploadDicomStudy`: Nahrání DICOM studie s vazbou na pacienta

#### 2.3 Orthanc Integrace
- [ ] Implementace REST API klienta pro Orthanc
- [ ] Metody pro upload DICOM studií
- [ ] Parsování DICOM metadat
- [ ] Implementace stahování a zobrazování studií
- [ ] Mapování DICOM studií na pacienty v databázi

#### 2.4 Autentizace a Zabezpečení
- [ ] Implementovat JWT autentizaci
- [ ] Vytvořit role uživatelů (lékař, admin, pacient)
- [ ] Implementovat refresh token mechanismus
- [ ] Nastavit autorizační middleware pro GraphQL
- [ ] Implementovat šifrování citlivých dat

### 3. FRONTEND IMPLEMENTACE

#### 3.1 Základní Struktura
- [ ] Nastavit Next.js 15 projekt
- [ ] Konfigurace TypeScript
- [ ] Implementovat routování
- [ ] Nastavit globální styly Tailwind CSS

#### 3.2 Komponenty
- [ ] DICOM Viewer komponenta
  - Integrace OHIF Viewer
  - Podpora zoomování a měření
  - Navigace mezi snímky
- [ ] Seznam pacientů
  - Tabulkové zobrazení
  - Filtrace a stránkování
  - Vyhledávání
- [ ] Detail pacienta
  - Osobní informace
  - Historie diagnóz
  - DICOM studie
  - Nahrávání nových studií

#### 3.3 GraphQL Integrace
- [ ] Nastavit GraphQL klienta
- [ ] Implementovat dotazy pro pacienty
- [ ] Vytvořit mutace pro správu dat
- [ ] Implementovat cachování dat
- [ ] Řešení optimistických updateů

#### 3.4 Autentizace
- [ ] Přihlašovací stránka
- [ ] Registrační formulář
- [ ] Ochrana routingu
- [ ] Správa uživatelských tokenů
- [ ] Reset hesla

### 4. DATABÁZE A MIGRACE
- [ ] Návrh Supabase schématu
- [ ] Migrace pro pacienty
- [ ] Migrace pro DICOM studie
- [ ] Indexace a optimalizace
- [ ] Nastavení relací mezi tabulkami

### 5. DOCKER KONTEJNERIZACE
- [ ] Dockerfile pro backend
- [ ] Dockerfile pro frontend
- [ ] Dockerfile pro Orthanc
- [ ] Docker Compose konfigurace
- [ ] Síťové propojení služeb
- [ ] Konfigurace proměnných prostředí
- [ ] Zdravotní kontroly kontejnerů

### 6. KONTINUÁLNÍ INTEGRACE
- [ ] GitHub Actions workflow
- [ ] Automatizované testování
- [ ] Statická analýza kódu
- [ ] Bezpečnostní kontroly
- [ ] Automatické nasazení

### 7. TESTOVÁNÍ
#### Backend Testy
- [ ] Unit testy modelů
- [ ] Integační testy API
- [ ] Testy autentizace
- [ ] Testy GraphQL resolverů
- [ ] Zátěžové testy

#### Frontend Testy
- [ ] Unit testy komponent
- [ ] E2E testy
- [ ] Test pokrytí
- [ ] Accessibility testy
- [ ] Testy výkonu

### 8. DOKUMENTACE
- [ ] README s instalací
- [ ] API dokumentace
- [ ] Vývojářská příručka
- [ ] Architektonický diagram
- [ ] Uživatelská dokumentace

### 9. FINALIZACE A NASAZENÍ
- [ ] Komplexní code review
- [ ] Finální integrace
- [ ] Penetrační testování
- [ ] Příprava produkčního prostředí
- [ ] Migrace dat
- [ ] Školení uživatelů

## 🚀 MILNÍKY
1. Backend základy: T+2 týdny
2. Frontend základy: T+4 týdny
3. Integrace služeb: T+6 týdnů
4. Testování: T+8 týdnů
5. Finalizace: T+10 týdnů

## ⚠️ RIZIKA
- Komplexní DICOM integrace
- Výkon GraphQL
- Bezpečnost zdravotních dat
- Autentizační mechanismy
- Škálovatelnost systému

## 💡 KLÍČOVÉ PRINCIPY
- Čistý, udržovatelný kód
- Průběžná komunikace
- Flexibilita
- Zaměření na bezpečnost
- Výkonnost a škálovatelnost

## 📦 ZÁVISLOSTI
### Backend
- HotChocolate
- Entity Framework Core
- Supabase.NET
- RestSharp
- System.IdentityModel.Tokens.Jwt

### Frontend
- @ohif/viewer
- graphql-request
- @tanstack/react-query
- cornerstone-web
- next-auth

## 🔐 BEZPEČNOSTNÍ POŽADAVKY
- Šifrování citlivých dat
- Řízení přístupových práv
- Ochrana před útoky
- Soulad s GDPR
- Pravidelné bezpečnostní audity

## 🌐 PROSTŘEDÍ
- Vývoj: Lokální Docker
- Staging: Cloudové prostředí
- Produkce: Škálovatelná infrastruktura

## 📝 POZNÁMKY K IMPLEMENTACI
- Pravidelné code review
- Dodržování SOLID principů
- Konzistentní kódovací standardy
- Průběžná optimalizace
- Dokumentace technických rozhodnutí
- Responzivní design pro různá zařízení
- Intuitivní rozhraní pro efektivní prohlížení zdravotních dat

## 🚀 NeuronaLabs - Implementační Roadmapa

## 🎯 Dokončené Milníky
- [x] Návrh architektury systému
- [x] Implementace backend infrastruktury
- [x] Vývoj GraphQL API
- [x] DICOM integrace
- [x] Autentizační systém
- [x] Docker kontejnerizace
- [x] Kubernetes konfigurace
- [x] CI/CD pipeline
- [x] Základní dokumentace

## 🔜 Nadcházející Milníky

### Krátkodobé Cíle (Q1 2024)
- [ ] Rozšířené testování
  - [ ] Unit testy backendu
  - [ ] Integační testy
  - [ ] E2E testy
- [ ] Vylepšení bezpečnosti
  - [ ] Penetrační testování
  - [ ] Audit bezpečnostních kontrol
- [ ] Optimalizace výkonu
  - [ ] Profilování a optimalizace databázových dotazů
  - [ ] Implementace cachování

### Střednědobé Cíle (Q2 2024)
- [ ] Pokročilé funkce DICOM
  - [ ] Podpora více formátů DICOM
  - [ ] Pokročilé AI analýzy snímků
- [ ] Rozšířené monitorování
  - [ ] Detailní Grafana dashboardy
  - [ ] Komplexní logování
- [ ] Uživatelské rozhraní
  - [ ] Responzivní design
  - [ ] Vylepšení UX/UI
  - [ ] Podpora tmavého módu

### Dlouhodobé Cíle (Q3-Q4 2024)
- [ ] Mezinárodní standardy
  - [ ] HIPAA compliance
  - [ ] GDPR implementace
- [ ] Škálovatelnost
  - [ ] Podpora multi-tenancy
  - [ ] Distribuované zpracování
- [ ] ML/AI Integrace
  - [ ] Prediktivní analýzy
  - [ ] Automatická detekce anomálií

## 🛠 Technické Dluhy
- Dokončení kompletní dokumentace
- Zvýšení pokrytí testů
- Průběžná aktualizace závislostí

## 🔍 Průběžné Aktivity
- Pravidelné bezpečnostní audity
- Sledování technologických trendů
- Zpětná vazba od uživatelů

## 💡 Inovační Plány
- Integrace strojového učení
- Podpora hlasových příkazů
- Rozšířená analytika

## 📊 Metriky Úspěchu
- Spolehlivost systému > 99.9%
- Doba odezvy < 200ms
- Pokrytí testů > 90%
- Minimální počet bezpečnostních incidentů

## 🤝 Spolupráce
- Aktivní komunikace s komunitou
- Open-source příspěvky
- Hackathony a vývojové workshopy
# NeuronaLabs DICOM Backend

## 🏥 Project Overview
NeuronaLabs is an advanced DICOM metadata management and visualization platform designed for medical imaging professionals.

## 🚀 Features
- DICOM Study Management
- GraphQL API for Metadata Retrieval
- OHIF Viewer Integration
- Supabase Backend
- Robust Error Handling

## 🛠 Tech Stack
- .NET Core 8.0
- HotChocolate GraphQL
- Entity Framework Core
- Supabase
- fo-dicom Library

## 📦 Prerequisites
- .NET SDK 8.0
- Docker (optional, for containerization)
- Supabase Account

## 🔧 Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/NeuronaLabs/dicom-backend.git
cd dicom-backend
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your configuration
nano .env
```

### 3. Install Dependencies
```bash
dotnet restore
```

### 4. Database Migration
```bash
dotnet ef database update
```

### 5. Run the Application
```bash
dotnet run
```

## 🧪 Testing
```bash
dotnet test
```

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

## 🔐 Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase project API key
- `DICOM_STORAGE_PATH`: Local DICOM file storage path
- `ORTHANC_URL`: Orthanc DICOM server URL

## 📊 Performance Considerations
- Implement caching strategies
- Use asynchronous processing for large DICOM studies
- Monitor database query performance

## 🚨 Error Handling
- Comprehensive logging
- Graceful error responses
- Detailed error tracking

## 🔍 Monitoring and Observability
- Integrate Application Insights
- Implement distributed tracing
- Set up performance metrics

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License
MIT License

## 📞 Contact
- Project Lead: [Your Name]
- Email: support@neuronalabs.com

## 🛡️ Security
Please report security vulnerabilities privately to security@neuronalabs.com
# 🚀 NeuronaLabs - Release Notes

## Verze 1.0.0 (Leden 2024)

### 🌟 Hlavní Funkce
- Komplexní správa zdravotnických dat
- Pokročilá DICOM integrace
- Zabezpečený autentizační systém
- GraphQL API
- Kontejnerizace a Kubernetes podpora

### 🛠 Technologie
- Backend: .NET 8.0
- Frontend: Next.js 15
- Databáze: PostgreSQL (Supabase)
- DICOM: FellowOakDicom, OHIF Viewer
- Kontejnerizace: Docker
- Orchestrace: Kubernetes

### ✨ Novinky
- Plně funkční autentizační systém
- Podpora DICOM studií
- Grafické rozhraní pro správu pacientů
- Pokročilé vyhledávání
- CI/CD pipeline
- Kubernetes deployment

### 🔒 Bezpečnostní Vylepšení
- JWT autentizace
- Role-based přístup
- Šifrování citlivých dat
- Ochrana proti běžným zranitelnostem

### 🐛 Opravené Chyby
- Řešení drobných problémů s výkonem
- Optimalizace databázových dotazů
- Zvýšení stability systému

### 🔜 Plánované Aktualizace
- Rozšířené testování
- Vylepšení bezpečnosti
- Podpora dalších DICOM formátů
- AI analýzy snímků

### 📦 Závislosti
- .NET 8.0 SDK
- Node.js 18+
- Docker
- Kubernetes

### 🤝 Kompatibilita
- Kompatibilní s většinou moderních prohlížečů
- Podpora Windows, macOS, Linux
- Optimalizováno pro velké zdravotnické instituce

### 📝 Poznámky
- Doporučeno pro profesionální zdravotnické použití
- Vyžaduje dodržování místních předpisů o ochraně dat

## Instalace
Kompletní instalační příručku naleznete v `README.md`

## Podpora
Pro technickou podporu kontaktujte `podpora@neuronalabs.cz`

## Licence
MIT License
# 🔒 Penetrační Testování NeuronaLabs

## 🎯 Cíle Testování
- Identifikace bezpečnostních zranitelností
- Ověření ochrany citlivých zdravotnických dat
- Testování autentizačního a autorizačního systému

## 🛡️ Rozsah Testování

### 1. Autentizace a Autorizace
- ✅ Test síly hesel
- ✅ Ochrana proti útokům hrubou silou
- ✅ Ověření JWT token managementu
- ✅ Testování role-based přístupů

#### Testovací Scénáře
- Pokusy o neoprávněný přístup
- Manipulace s JWT tokeny
- Testování slabých hesel

### 2. Ochrana Dat
- ✅ Šifrování citlivých údajů
- ✅ Anonymizace DICOM studií
- ✅ Ochrana před SQL Injection
- ✅ Prevence Cross-Site Scripting (XSS)

#### Testovací Scénáře
- Pokusy o extrakci citlivých dat
- Testování šifrování dat v klidovém stavu
- Ověření anonymizačních mechanismů

### 3. Síťová Bezpečnost
- ✅ HTTPS/TLS konfigurace
- ✅ CORS nastavení
- ✅ Ochrana před CSRF útoky
- ✅ Konfigurace firewallu

#### Testovací Scénáře
- Testování SSL/TLS konfigurace
- Ověření CORS politiky
- Detekce potenciálních síťových zranitelností

### 4. Infrastrukturní Bezpečnost
- ✅ Konfigurace Kubernetes
- ✅ Docker kontejner bezpečnost
- ✅ Konfigurace sítě
- ✅ Řízení přístupových práv

#### Testovací Scénáře
- Analýza Docker image
- Testování síťových politik
- Ověření minimálních oprávnění

## 🛠 Nástroje pro Testování
- OWASP ZAP
- Burp Suite
- Nmap
- Metasploit
- Nikto
- SQLMap

## 📋 Postup Testování

### Přípravná Fáze
1. Nastavení testovacího prostředí
2. Konfigurace testovacích nástrojů
3. Definice testovacích scénářů

### Průběh Testování
1. Statická analýza kódu
2. Dynamické testování
3. Penetrační testování
4. Analýza zranitelností

### Vyhodnocení
- Kategorizace nalezených zranitelností
- Stanovení rizikové úrovně
- Návrh nápravných opatření

## 🚨 Kritické Bezpečnostní Kontroly
- Žádné citlivé údaje v konfiguracích
- Minimální oprávnění pro služby
- Pravidelné bezpečnostní audity
- Oddělení produkčního a testovacího prostředí

## 📊 Reporting
- Detailní zpráva o nalezených zranitelnostech
- Doporučení pro nápravu
- Klasifikace rizik
- Plán implementace oprav

## 🔄 Následné Kroky
1. Implementace nalezených oprav
2. Opakované testování
3. Pravidelné bezpečnostní kontroly

## 📝 Poznámky
- Testování probíhá v izolovaném prostředí
- Všechny citlivé údaje jsou anonymizovány
- Dodržování etických standardů testování
