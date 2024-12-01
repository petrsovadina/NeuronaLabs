const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Konfigurace pro generování dat
const CONFIG = {
  numberOfPatients: 50,
  diagnosisTypes: ['MRI', 'CT', 'EEG', 'EMG', 'PET'],
  insuranceCompanies: [
    'VZP', 'VOZP', 'ČPZP', 'OZP', 'ZPŠ', 'ZPMV', 'RBP'
  ],
  testUser: {
    email: 'admin@admin.cz',
    password: 'admin',
    userData: {
      role: 'admin',
      first_name: 'Admin',
      last_name: 'Test',
      title: 'MUDr.',
      specialization: 'Neurologie',
    }
  }
};

// Získání nebo vytvoření testovacího uživatele
async function getOrCreateTestUser() {
  console.log('Kontroluji testovacího uživatele...');
  
  try {
    // Nejprve zkontrolujeme, jestli uživatel už neexistuje
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', CONFIG.testUser.email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingUser) {
      console.log('Testovací uživatel nalezen.');
      return existingUser.id;
    }

    console.log('Vytvářím nového testovacího uživatele...');
    // Vytvoření uživatele v auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: CONFIG.testUser.email,
      password: CONFIG.testUser.password,
      email_confirm: true,
      user_metadata: CONFIG.testUser.userData
    });

    if (authError) {
      // Pokud uživatel už existuje v auth.users, zkusíme ho najít
      if (authError.status === 422 && authError.code === 'email_exists') {
        const { data: authData } = await supabase.auth.admin.listUsers();
        const existingAuthUser = authData.users.find(u => u.email === CONFIG.testUser.email);
        if (existingAuthUser) {
          console.log('Testovací uživatel nalezen v auth.users.');
          return existingAuthUser.id;
        }
      }
      throw authError;
    }

    console.log('Testovací uživatel úspěšně vytvořen.');
    return authUser.user.id;
  } catch (error) {
    console.error('Chyba při práci s testovacím uživatelem:', error);
    throw error;
  }
}

// Generování náhodného pacienta
function generatePatient(doctorId) {
  const gender = faker.helpers.arrayElement(['male', 'female']);
  const firstName = gender === 'male' ? faker.person.firstName('male') : faker.person.firstName('female');
  const lastName = faker.person.lastName();
  
  return {
    doctor_id: doctorId,
    first_name: firstName,
    last_name: lastName,
    birth_date: faker.date.between({ 
      from: '1940-01-01', 
      to: '2005-12-31' 
    }).toISOString().split('T')[0],
    gender,
    email: faker.internet.email({ firstName, lastName }),
    phone: `+420${faker.string.numeric(9)}`,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    insurance_number: faker.string.numeric(10),
    insurance_company: faker.helpers.arrayElement(CONFIG.insuranceCompanies),
    medical_history: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    notes: faker.helpers.maybe(() => faker.lorem.sentences({ min: 1, max: 2 }), { probability: 0.5 }),
  };
}

// Generování náhodných diagnostických dat
function generateDiagnosticData(patientId, doctorId) {
  const diagnosisType = faker.helpers.arrayElement(CONFIG.diagnosisTypes);
  
  const diagnosisData = {
    type: diagnosisType,
    findings: faker.lorem.paragraph(),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
    recommendations: faker.lorem.sentences({ min: 1, max: 2 }),
    measurements: Array.from({ length: 3 }, () => ({
      name: faker.science.unit(),
      value: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
      unit: faker.science.unit(),
    })),
  };

  return {
    patient_id: patientId,
    doctor_id: doctorId,
    diagnosis_type: diagnosisType,
    diagnosis_date: faker.date.recent({ days: 90 }).toISOString(),
    diagnosis_data: diagnosisData,
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
  };
}

async function generateTestData() {
  try {
    // Získání nebo vytvoření testovacího uživatele
    const doctorId = await getOrCreateTestUser();
    
    console.log('Začínám generovat testovací data...');

    // Generování pacientů
    console.log(`Generuji ${CONFIG.numberOfPatients} pacientů...`);
    for (let i = 0; i < CONFIG.numberOfPatients; i++) {
      const patient = generatePatient(doctorId);
      
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert(patient)
        .select('id')
        .single();

      if (patientError) {
        console.error(`Chyba při vytváření pacienta ${i + 1}:`, patientError);
        continue;
      }

      // Pro každého pacienta vygenerujeme 1-5 diagnostických záznamů
      const numberOfDiagnoses = faker.number.int({ min: 1, max: 5 });
      console.log(`Generuji ${numberOfDiagnoses} diagnostických záznamů pro pacienta ${i + 1}...`);

      for (let j = 0; j < numberOfDiagnoses; j++) {
        const diagnosticData = generateDiagnosticData(patientData.id, doctorId);
        
        const { error: diagnosticError } = await supabase
          .from('diagnostic_data')
          .insert(diagnosticData);

        if (diagnosticError) {
          console.error(`Chyba při vytváření diagnostických dat pro pacienta ${i + 1}:`, diagnosticError);
        }
      }
    }

    console.log('Generování testovacích dat dokončeno!');
    console.log('Přihlašovací údaje testovacího uživatele:');
    console.log(`Email: ${CONFIG.testUser.email}`);
    console.log(`Heslo: ${CONFIG.testUser.password}`);
  } catch (error) {
    console.error('Neočekávaná chyba při generování dat:', error);
  }
}

// Spuštění generování dat
generateTestData();
