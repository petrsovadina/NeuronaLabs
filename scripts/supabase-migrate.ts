import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Načtení proměnných prostředí
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Chybí požadované proměnné prostředí:');
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Vytvoření Supabase klienta s admin právy
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigrations() {
  try {
    // Načtení všech migračních souborů
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Seřazení podle názvu

    console.log('Nalezené migrační soubory:', migrationFiles);

    // Vytvoření tabulky pro sledování migrací, pokud neexistuje
    const { error: createTableError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS _migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `
    });

    if (createTableError) {
      throw new Error(`Chyba při vytváření tabulky migrací: ${createTableError.message}`);
    }

    // Provedení jednotlivých migrací
    for (const file of migrationFiles) {
      // Kontrola, zda migrace již byla provedena
      const { data: existingMigration, error: checkError } = await supabase
        .from('_migrations')
        .select('name')
        .eq('name', file)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Chyba při kontrole migrace ${file}: ${checkError.message}`);
      }

      if (existingMigration) {
        console.log(`Migrace ${file} již byla provedena, přeskakuji...`);
        continue;
      }

      // Načtení a provedení migrace
      const migrationContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      const { error: migrationError } = await supabase.rpc('execute_sql', {
        query: migrationContent
      });

      if (migrationError) {
        throw new Error(`Chyba při provádění migrace ${file}: ${migrationError.message}`);
      }

      // Zaznamenání úspěšné migrace
      const { error: recordError } = await supabase
        .from('_migrations')
        .insert({ name: file });

      if (recordError) {
        throw new Error(`Chyba při záznamu migrace ${file}: ${recordError.message}`);
      }

      console.log(`Úspěšně provedena migrace: ${file}`);
    }

    console.log('Všechny migrace byly úspěšně provedeny!');
  } catch (error) {
    console.error('Chyba při provádění migrací:', error);
    process.exit(1);
  }
}

// Spuštění migrací
runMigrations();
