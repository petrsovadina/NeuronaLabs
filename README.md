# NeuronaLabs Medical Platform 🏥

## 🌟 Projekt Overview
Komplexní platforma pro správu zdravotnických dat s pokročilou integrací DICOM a zabezpečeným managementem pacientských informací.

## 🚀 Technologický Stack
- **Backend**: .NET 8.0 s GraphQL (HotChocolate)
- **Frontend**: Next.js 15 s React
- **Databáze**: Supabase (PostgreSQL)
- **DICOM**: Orthanc Server, OHIF Viewer
- **Kontejnerizace**: Docker Compose
- **Autentizace**: Supabase Auth s JWT

## 🔧 Požadavky
- Docker
- Docker Compose
- Make (volitelné)
- Git

## 🛠 Instalace a Konfigurace

### 1. Klonování repozitáře
```bash
git clone https://github.com/vaše-organizace/neuronalabs.git
cd neuronalabs
```

### 2. Příprava prostředí
```bash
# Kopírování konfiguračního souboru
cp .env.example .env

# Úprava konfigurace podle vašeho prostředí
nano .env
```

### 3. Inicializace projektu
```bash
# Příprava projektu (generování tajných klíčů, stažení obrazů)
make setup

# Spuštění všech služeb
make up
```

## 🌐 Dostupné služby

| Služba | URL | Popis |
|--------|-----|-------|
| Frontend | `http://localhost:3000` | Hlavní uživatelské rozhraní |
| Backend API | `http://localhost:5000` | GraphQL API endpoint |
| Supabase Studio | `http://localhost:3020` | Správa databáze |
| Orthanc DICOM | `http://localhost:8042` | DICOM server |
| OHIF Viewer | `http://localhost:3010` | Prohlížeč DICOM snímků |
| Prometheus | `http://localhost:9090` | Monitoring |

## 📋 Dostupné Make příkazy

- `make setup`: Inicializace projektu
- `make up`: Spuštění služeb
- `make down`: Zastavení služeb
- `make restart`: Restart služeb
- `make logs`: Zobrazení logů
- `make migrate`: Migrace databáze
- `make test`: Spuštění testů
- `make clean`: Vyčištění Docker prostoru

## 🔐 Konfigurace a Zabezpečení

### Tajné klíče
Projekt automaticky generuje tajné klíče pomocí `make secrets`:
- JWT token
- Supabase service key

### Proměnné prostředí
Všechny konfigurace jsou spravovány přes `.env` soubor. Viz `.env.example` pro referenci.

## 📊 Databázové schéma

### Tabulky
- `patients`: Osobní informace pacientů
- `diagnoses`: Lékařské diagnózy a léčby
- `dicom_studies`: Metadata DICOM studií

### Bezpečnostní funkce
- Automatické aktualizace timestampů
- Řízení přístupu na úrovni řádků (RLS)
- Jedinečné constrainty a validace

## 🧪 Testování

### Spuštění testů
```bash
make test
```

## 🚢 Nasazení

### Produkční prostředí
- Konfigurace pro produkci v `.env`
- Podpora nasazení přes Docker Compose
- Škálovatelná architektura mikroslužeb

## 🤝 Přispívání

1. Forkněte repozitář
2. Vytvořte feature branch
3. Commitněte změny
4. Pushněte branch
5. Vytvořte Pull Request

## 📝 Licence

[Doplňte licenční informace]

## 🆘 Podpora

Pro technickou podporu a dotazy kontaktujte [váš kontakt]

## 🔮 Budoucí Plány

- Implementace komplexního logování
- Nastavení monitorovacích dashboardů
- Penetrační testování
- Vytvoření detailní uživatelské dokumentace

---

**Poznámka**: Před použitím si prosím pečlivě prostudujte konfigurační soubory a nastavte všechna potřebná proměnná prostředí.
