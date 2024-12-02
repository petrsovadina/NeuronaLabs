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

-- Vložení testovacích lékařů
INSERT INTO doctors (
    id,
    first_name,
    last_name,
    specialization,
    email,
    phone_number
) VALUES (
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'Jan',
    'Novák',
    'Neurologie',
    'admin@admin.cz',
    '+420123456789'
);

-- Vložení testovacích pacientů
INSERT INTO patients (
    id,
    first_name,
    last_name,
    birth_date,
    gender,
    email,
    phone_number,
    address
)
SELECT 
    gen_random_uuid(),
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
    jsonb_build_object(
        'street', 'Ulice ' || generate_series,
        'city', 'Praha',
        'postal_code', '110 00',
        'country', 'Czech Republic'
    )
FROM generate_series(1, 10);

-- Vložení testovacích diagnóz
INSERT INTO diagnoses (
    patient_id,
    doctor_id,
    diagnosis_date,
    diagnosis_type,
    description,
    severity,
    treatment_plan
)
SELECT 
    p.id,
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    NOW() - (generate_series || ' days')::interval,
    CASE (random() * 3)::integer
        WHEN 0 THEN 'Neurologické vyšetření'
        WHEN 1 THEN 'Kardiologické vyšetření'
        ELSE 'Ortopedické vyšetření'
    END,
    'Testovací diagnóza pro pacienta ' || generate_series,
    CASE (random() * 4)::integer
        WHEN 0 THEN 'low'
        WHEN 1 THEN 'medium'
        WHEN 2 THEN 'high'
        ELSE 'critical'
    END,
    'Doporučeno další vyšetření'
FROM patients p, generate_series(1, 10);

-- Vložení testovacích DICOM studií
INSERT INTO dicom_studies (
    patient_id,
    study_instance_uid,
    study_date,
    modality,
    study_description,
    study_location
)
SELECT 
    p.id,
    'UID.' || gen_random_uuid()::text,
    NOW() - (generate_series || ' days')::interval,
    CASE (random() * 3)::integer
        WHEN 0 THEN 'CT'
        WHEN 1 THEN 'MRI'
        ELSE 'X-RAY'
    END,
    'Testovací DICOM studie pro pacienta ' || generate_series,
    '/storage/dicom/' || gen_random_uuid()::text
FROM patients p, generate_series(1, 10);

-- Vložení testovacích léků
INSERT INTO medications (
    patient_id,
    prescribed_by,
    medication_name,
    dosage,
    prescription_date,
    start_date,
    end_date,
    instructions
)
SELECT 
    p.id,
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    CASE (random() * 5)::integer
        WHEN 0 THEN 'Paralen'
        WHEN 1 THEN 'Ibuprofen'
        WHEN 2 THEN 'Aspirin'
        WHEN 3 THEN 'Amoxicilin'
        ELSE 'Brufen'
    END,
    CASE (random() * 3)::integer
        WHEN 0 THEN '500mg'
        WHEN 1 THEN '250mg'
        ELSE '1000mg'
    END,
    NOW() - (generate_series || ' days')::interval,
    NOW() - (generate_series || ' days')::interval,
    NOW() + ((generate_series * 7) || ' days')::interval,
    'Užívat dle potřeby'
FROM patients p, generate_series(1, 10);

-- Vložení testovacích alergií
INSERT INTO allergies (
    patient_id,
    allergen,
    severity,
    reaction,
    first_observed_date
)
SELECT 
    p.id,
    CASE (random() * 5)::integer
        WHEN 0 THEN 'Prach'
        WHEN 1 THEN 'Pyl'
        WHEN 2 THEN 'Mléko'
        WHEN 3 THEN 'Arašídy'
        ELSE 'Latex'
    END,
    CASE (random() * 4)::integer
        WHEN 0 THEN 'mild'
        WHEN 1 THEN 'moderate'
        WHEN 2 THEN 'severe'
        ELSE 'life-threatening'
    END,
    'Testovací alergická reakce',
    NOW() - (generate_series || ' days')::interval
FROM patients p, generate_series(1, 10);

-- Vložení testovacích lékařských záznamů
INSERT INTO medical_records (
    patient_id,
    doctor_id,
    record_date,
    record_type,
    description,
    notes
)
SELECT 
    p.id,
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    NOW() - (generate_series || ' days')::interval,
    CASE (random() * 4)::integer
        WHEN 0 THEN 'Pravidelná prohlídka'
        WHEN 1 THEN 'Kontrolní vyšetření'
        WHEN 2 THEN 'Předoperační vyšetření'
        ELSE 'Následná péče'
    END,
    'Testovací lékařský záznam pro pacienta ' || generate_series,
    jsonb_build_object(
        'additional_info', 'Žádné významné poznámky',
        'recommendations', 'Další kontrola za 6 měsíců'
    )
FROM patients p, generate_series(1, 10);
