-- Smazání existujících tabulek v bezpečném pořadí
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS diagnoses CASCADE;
DROP TABLE IF EXISTS dicom_studies CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- Tabulka pro pacienty
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT UNIQUE,
    phone_number TEXT,
    address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_patients_modtime
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_patients_name ON patients(first_name, last_name);

-- Tabulka pro lékaře
CREATE TABLE doctors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_doctors_modtime
BEFORE UPDATE ON doctors
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Tabulka pro diagnózy
CREATE TABLE diagnoses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    diagnosis_date DATE NOT NULL,
    diagnosis_type TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    treatment_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_diagnoses_modtime
BEFORE UPDATE ON diagnoses
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX idx_diagnoses_doctor ON diagnoses(doctor_id);

-- Tabulka pro DICOM studie
CREATE TABLE dicom_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    study_instance_uid TEXT UNIQUE NOT NULL,
    study_date DATE NOT NULL,
    modality TEXT NOT NULL, 
    study_description TEXT,
    study_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_dicom_studies_modtime
BEFORE UPDATE ON dicom_studies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_dicom_studies_patient ON dicom_studies(patient_id);

-- Tabulka pro léky
CREATE TABLE medications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    prescription_date DATE NOT NULL,
    prescribed_by UUID REFERENCES doctors(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_medications_modtime
BEFORE UPDATE ON medications
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_medications_doctor ON medications(prescribed_by);

-- Tabulka pro alergie
CREATE TABLE allergies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergen TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
    reaction TEXT,
    first_observed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_allergies_modtime
BEFORE UPDATE ON allergies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_allergies_patient ON allergies(patient_id);

-- Tabulka pro lékařské záznamy
CREATE TABLE medical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    record_date DATE NOT NULL,
    record_type TEXT NOT NULL,
    description TEXT,
    notes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pro automatickou aktualizaci timestampu
CREATE TRIGGER update_medical_records_modtime
BEFORE UPDATE ON medical_records
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexy pro optimalizaci
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);

-- RLS politiky pro zabezpečení dat
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dicom_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení vlastních dat
CREATE POLICY "Users can view own patient data" 
ON patients FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can view own diagnoses" 
ON diagnoses FOR SELECT 
USING (auth.uid() = (SELECT id FROM patients WHERE patients.id = patient_id));

CREATE POLICY "Users can view own DICOM studies" 
ON dicom_studies FOR SELECT 
USING (auth.uid() = (SELECT id FROM patients WHERE patients.id = patient_id));

CREATE POLICY "Users can view own medications" 
ON medications FOR SELECT 
USING (auth.uid() = (SELECT id FROM patients WHERE patients.id = patient_id));

CREATE POLICY "Users can view own allergies" 
ON allergies FOR SELECT 
USING (auth.uid() = (SELECT id FROM patients WHERE patients.id = patient_id));

CREATE POLICY "Users can view own medical records" 
ON medical_records FOR SELECT 
USING (auth.uid() = (SELECT id FROM patients WHERE patients.id = patient_id));

-- Triggery pro automatickou aktualizaci timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
