-- Tabulka pacientů
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Tabulka DICOM studií
CREATE TABLE dicom_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    study_date TIMESTAMPTZ NOT NULL,
    modality TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    full_study_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Rozšířená tabulka uživatelů
ALTER TABLE auth.users ADD COLUMN 
    role TEXT CHECK (role IN ('admin', 'doctor', 'patient')) DEFAULT 'patient';

-- Indexy pro optimalizaci
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_dicom_studies_patient_id ON dicom_studies(patient_id);
CREATE INDEX idx_dicom_studies_user_id ON dicom_studies(user_id);

-- RLS politiky pro pacienty
CREATE POLICY "Users can view own patients" 
ON patients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all patients" 
ON patients FOR ALL 
USING (role() = 'admin');

-- RLS politiky pro DICOM studie
CREATE POLICY "Users can view own DICOM studies" 
ON dicom_studies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all DICOM studies" 
ON dicom_studies FOR ALL 
USING (role() = 'admin');

-- Trigger pro automatickou aktualizaci timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_modtime
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
