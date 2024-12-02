-- Povolit rozšíření pro UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Funkce pro automatickou aktualizaci timestampů
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Nastavení Row Level Security pro všechny tabulky
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated, service_role;

-- Vytvoření role pro různé úrovně přístupu
DO $$
BEGIN
    -- Vytvoření role pro lékaře
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'doctor') THEN
        CREATE ROLE doctor;
    END IF;

    -- Vytvoření role pro pacienty
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'patient') THEN
        CREATE ROLE patient;
    END IF;
END $$;

-- Nastavení základních schémat pro autentizaci a zabezpečení
GRANT USAGE ON SCHEMA public TO authenticated, service_role, doctor, patient;
GRANT ALL ON SCHEMA public TO service_role;

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'receptionist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE insurance_status AS ENUM ('active', 'expired', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE diagnosis_status AS ENUM ('preliminary', 'confirmed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE study_type AS ENUM ('mri', 'ct', 'xray', 'ultrasound', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
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
    medical_record_number TEXT UNIQUE NOT NULL,
    insurance_number TEXT,
    insurance_company TEXT,
    insurance_status insurance_status DEFAULT 'pending',
    status patient_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    assigned_doctor_id UUID REFERENCES public.users(id)
);

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    diagnosis_code TEXT NOT NULL,
    description TEXT NOT NULL,
    status diagnosis_status DEFAULT 'preliminary',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create studies table
CREATE TABLE IF NOT EXISTS public.studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    study_type study_type NOT NULL,
    study_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    dicom_study_uid TEXT,
    storage_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

-- Patients policies
CREATE POLICY "Users can view all patients" ON public.patients
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create patients" ON public.patients
    FOR INSERT TO authenticated
    WITH CHECK (
        -- Allow creating patients for authenticated users
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Doctors and admins can manage all patients" ON public.patients
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.role = 'doctor' OR users.role = 'admin')
        )
    ) WITH CHECK (
        -- Allow creating and updating patients for doctors and admins
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.role = 'doctor' OR users.role = 'admin')
        )
    );

CREATE POLICY "Users can manage their own patient records" ON public.patients
    FOR ALL TO authenticated
    USING (
        -- Allow users to view and update their own patient records
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (
                users.id = patients.created_by OR  -- Created by the user
                users.id = patients.assigned_doctor_id  -- Assigned doctor
            )
        )
    ) WITH CHECK (
        -- Ensure only authorized users can modify
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (
                users.id = patients.created_by OR  -- Created by the user
                users.id = patients.assigned_doctor_id  -- Assigned doctor
                OR users.role = 'admin'  -- Admins can always modify
            )
        )
    );

-- Diagnoses policies
CREATE POLICY "Users can view all diagnoses" ON public.diagnoses
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Doctors can manage diagnoses" ON public.diagnoses
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Studies policies
CREATE POLICY "Users can view all studies" ON public.studies
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Doctors can manage studies" ON public.studies
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnoses_updated_at
    BEFORE UPDATE ON public.diagnoses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_studies_updated_at
    BEFORE UPDATE ON public.studies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
