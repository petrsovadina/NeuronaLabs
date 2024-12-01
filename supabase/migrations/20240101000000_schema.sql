-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'receptionist');
CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE study_type AS ENUM ('mri', 'ct', 'xray', 'ultrasound', 'other');
CREATE TYPE diagnosis_status AS ENUM ('preliminary', 'confirmed', 'archived');
CREATE TYPE insurance_status AS ENUM ('active', 'expired', 'pending');

-- Grant necessary permissions
ALTER ROLE anon SET search_path TO public;
ALTER ROLE authenticated SET search_path TO public;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'doctor',
    specialization TEXT,
    license_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    medical_record_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Czech Republic',
    status patient_status DEFAULT 'active',
    insurance_provider TEXT,
    insurance_number TEXT,
    insurance_status insurance_status DEFAULT 'active',
    blood_type TEXT,
    allergies TEXT[],
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_history TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Create diagnostic_data table
CREATE TABLE diagnostic_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    diagnosis_type TEXT NOT NULL,
    diagnosis_date TIMESTAMPTZ DEFAULT NOW(),
    diagnosis_data JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create DICOM studies table
CREATE TABLE dicom_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    study_date TIMESTAMPTZ NOT NULL,
    study_type study_type NOT NULL,
    modality TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    full_study_url TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    duration INTERVAL NOT NULL DEFAULT INTERVAL '30 minutes',
    status appointment_status DEFAULT 'scheduled',
    appointment_type TEXT NOT NULL,
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES users(id)
);

-- Create diagnoses table
CREATE TABLE diagnoses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    icd_code TEXT,
    diagnosis_name TEXT NOT NULL,
    description TEXT,
    status diagnosis_status DEFAULT 'preliminary',
    diagnosis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    treatment_plan TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dashboard_stats view
CREATE OR REPLACE VIEW dashboard_stats AS
WITH stats AS (
    SELECT 
        p.doctor_id,
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT d.id) as total_diagnoses
    FROM patients p
    LEFT JOIN diagnostic_data d ON p.id = d.patient_id
    GROUP BY p.doctor_id
)
SELECT 
    doctor_id,
    total_patients,
    total_diagnoses
FROM stats;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnostic_data_updated_at
    BEFORE UPDATE ON diagnostic_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dicom_studies_updated_at
    BEFORE UPDATE ON dicom_studies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnoses_updated_at
    BEFORE UPDATE ON diagnoses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX idx_patients_medical_record_number ON patients(medical_record_number);
CREATE INDEX idx_diagnostic_data_patient_id ON diagnostic_data(patient_id);
CREATE INDEX idx_diagnostic_data_doctor_id ON diagnostic_data(doctor_id);
CREATE INDEX idx_dicom_studies_patient_id ON dicom_studies(patient_id);
CREATE INDEX idx_dicom_studies_doctor_id ON dicom_studies(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_diagnoses_patient_id ON diagnoses(patient_id);
CREATE INDEX idx_diagnoses_doctor_id ON diagnoses(doctor_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE dicom_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public users are viewable by everyone."
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Doctors can manage their patients"
    ON patients FOR ALL
    USING (
        auth.uid() = doctor_id 
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'doctor')
        )
    );

CREATE POLICY "Doctors can view their diagnostic data"
    ON diagnostic_data FOR SELECT
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can manage their diagnostic data"
    ON diagnostic_data FOR ALL
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can view their DICOM studies"
    ON dicom_studies FOR SELECT
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can manage their DICOM studies"
    ON dicom_studies FOR ALL
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can view their appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can manage their appointments"
    ON appointments FOR ALL
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can view their diagnoses"
    ON diagnoses FOR SELECT
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Doctors can manage their diagnoses"
    ON diagnoses FOR ALL
    USING (auth.uid() = doctor_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
