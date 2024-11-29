import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createMigration() {
  try {
    // Získání názvu migrace od uživatele
    const migrationName = await new Promise<string>((resolve) => {
      rl.question('Zadejte název migrace (např. "add_users_table"): ', (answer) => {
        resolve(answer.toLowerCase().replace(/\s+/g, '_'));
      });
    });

    // Vytvoření timestampu
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const fileName = `${timestamp}_${migrationName}.sql`;

    // Vytvoření cesty k souboru
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const filePath = path.join(migrationsDir, fileName);

    // Kontrola, zda složka existuje
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    // Vytvoření základní šablony migrace
    const template = `-- Migrace: ${migrationName}
-- Vytvořeno: ${new Date().toISOString()}

-- Zde začněte psát své SQL příkazy

-- Například:
-- CREATE TABLE IF NOT EXISTS my_table (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- Nezapomeňte přidat Row Level Security, pokud je potřeba:
-- ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- A případně vytvořit policies:
-- CREATE POLICY "Users can view their own records"
--   ON my_table
--   FOR SELECT
--   USING (auth.uid() = user_id);
`;

    // Zápis do souboru
    fs.writeFileSync(filePath, template, 'utf-8');

    console.log(`\nMigrace byla úspěšně vytvořena: ${fileName}`);
    console.log(`Cesta k souboru: ${filePath}`);
    console.log('\nNyní můžete upravit soubor a přidat své SQL příkazy.');
    console.log('Po dokončení úprav spusťte "npm run migrate" pro aplikování změn.');

  } catch (error) {
    console.error('Chyba při vytváření migrace:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Spuštění vytvoření migrace
createMigration();
