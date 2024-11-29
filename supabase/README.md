# Supabase Migrace a Inicializace

Tento adresář obsahuje SQL migrace pro Supabase databázi.

## Jak aplikovat migrace

1. Přihlaste se do Supabase dashboardu
2. Jděte do sekce "SQL Editor"
3. Vyberte soubor `migrations/00001_initial_schema.sql`
4. Spusťte SQL příkazy

## Struktura databáze

### Tabulka `profiles`
- Rozšiřuje výchozí Supabase auth.users
- Obsahuje dodatečné informace o uživatelích
- Má nastavené Row Level Security (RLS)

### Bezpečnostní politiky
- Uživatelé mohou vidět pouze svůj vlastní profil
- Uživatelé mohou upravovat pouze svůj vlastní profil

### Triggery
- `on_auth_user_created`: Automaticky vytvoří profil při registraci nového uživatele
- `update_profiles_updated_at`: Automaticky aktualizuje časové razítko při úpravě profilu

## TypeScript typy
TypeScript typy pro databázi najdete v `frontend/types/supabase.ts`
