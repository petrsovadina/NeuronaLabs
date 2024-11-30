-- Vytvoření tabulky pro pacienty
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT,
    phone TEXT,
    address TEXT,
    insurance_number TEXT,
    insurance_company TEXT,
    medical_history TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky pro diagnostická data
CREATE TABLE IF NOT EXISTS diagnostic_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    diagnosis_type TEXT NOT NULL,
    diagnosis_date TIMESTAMPTZ DEFAULT NOW(),
    diagnosis_data JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření pohledu pro statistiky na dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
WITH stats AS (
    SELECT 
        doctor_id,
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT d.id) as total_diagnoses
    FROM patients p
    LEFT JOIN diagnostic_data d ON p.id = d.patient_id
    GROUP BY doctor_id
)
SELECT 
    doctor_id,
    total_patients,
    total_diagnoses
FROM stats;

-- Vytvoření RLS politik
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_data ENABLE ROW LEVEL SECURITY;

-- Politiky pro pacienty
CREATE POLICY "Lékaři vidí pouze své pacienty"
    ON patients FOR ALL
    USING (auth.uid() = doctor_id);

-- Politiky pro diagnostická data
CREATE POLICY "Lékaři vidí pouze svá diagnostická data"
    ON diagnostic_data FOR ALL
    USING (auth.uid() = doctor_id);

-- Triggery pro aktualizaci časových razítek
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnostic_data_updated_at
    BEFORE UPDATE ON diagnostic_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
