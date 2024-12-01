-- Seed data pro testovací účely

-- Vložení testovacího lékaře do auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'authenticated',
    'authenticated',
    'admin@admin.cz',
    crypt('admin123456', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now()
);

-- Vložení testovacího lékaře do users
INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    phone,
    role,
    specialization,
    license_number
) VALUES (
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'Jan',
    'Novák',
    'admin@admin.cz',
    '+420123456789',
    'doctor'::user_role,
    'Neurologie',
    'LEK123456'
);

-- Vložení testovacích pacientů
INSERT INTO patients (
    id,
    doctor_id,
    medical_record_number,
    first_name,
    last_name,
    birth_date,
    gender,
    email,
    phone,
    address,
    city,
    postal_code,
    country,
    status,
    insurance_number,
    insurance_company,
    insurance_status,
    notes
)
SELECT 
    gen_random_uuid(),
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'MRN' || LPAD(CAST(generate_series AS text), 6, '0'),
    'Pacient' || generate_series,
    'Příjmení' || generate_series,
    '1980-01-01'::date + (generate_series || ' years')::interval,
    CASE (random() * 2)::integer
        WHEN 0 THEN 'male'
        WHEN 1 THEN 'female'
        ELSE 'other'
    END,
    'pacient' || generate_series || '@example.com',
    '+420' || LPAD(CAST((900000000 + generate_series) AS text), 9, '0'),
    'Ulice ' || generate_series,
    'Praha',
    '110 00',
    'Czech Republic',
    CASE (random() * 2)::integer
        WHEN 0 THEN 'active'::patient_status
        WHEN 1 THEN 'inactive'::patient_status
        ELSE 'archived'::patient_status
    END,
    LPAD(CAST((1000000000 + generate_series) AS text), 10, '0'),
    'VZP',
    'active'::insurance_status,
    'Testovací pacient ' || generate_series
FROM generate_series(1, 10);

-- Vložení testovacích diagnóz
INSERT INTO diagnoses (
    id,
    patient_id,
    doctor_id,
    diagnosis_code,
    description,
    status,
    notes
)
SELECT 
    gen_random_uuid(),
    p.id,
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'ICD-' || LPAD(CAST(generate_series AS text), 3, '0'),
    'Diagnóza ' || generate_series,
    CASE (random() * 2)::integer
        WHEN 0 THEN 'preliminary'::diagnosis_status
        WHEN 1 THEN 'confirmed'::diagnosis_status
        ELSE 'archived'::diagnosis_status
    END,
    'Poznámka k diagnóze ' || generate_series
FROM generate_series(1, 20), (SELECT id FROM patients LIMIT 1) p;

-- Vložení testovacích vyšetření
WITH patient_ids AS (
    SELECT id FROM patients
)
INSERT INTO studies (
    id,
    patient_id,
    doctor_id,
    study_type,
    study_date,
    description,
    dicom_study_uid,
    storage_path,
    notes
)
SELECT 
    gen_random_uuid(),
    p.id,
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    CASE (random() * 4)::integer
        WHEN 0 THEN 'mri'::study_type
        WHEN 1 THEN 'ct'::study_type
        WHEN 2 THEN 'xray'::study_type
        WHEN 3 THEN 'ultrasound'::study_type
        ELSE 'other'::study_type
    END,
    now() - (generate_series || ' days')::interval,
    'Vyšetření ' || generate_series,
    '1.2.3.4.' || uuid_generate_v4(),
    '/storage/studies/' || generate_series,
    'Poznámka k vyšetření ' || generate_series
FROM generate_series(1, 15), (SELECT id FROM patients LIMIT 1) p;
