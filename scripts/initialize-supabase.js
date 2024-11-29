const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Chybí SUPABASE_URL nebo SUPABASE_SERVICE_KEY v prostředí.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'supabase-migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (path.extname(file) === '.sql') {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Aplikuji migraci: ${file}`);
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Chyba při aplikaci migrace ${file}:`, error);
        process.exit(1);
      }
    }
  }

  console.log('Všechny migrace byly úspěšně aplikovány.');
}

runMigrations().catch(console.error);

