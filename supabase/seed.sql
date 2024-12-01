-- Seed data pro testovací účely

-- Vložení testovacího lékaře do auth.users
DO $$
DECLARE
    _user_id uuid;
BEGIN
    -- Nejprve vyčistíme existující data
    DELETE FROM auth.users WHERE email = 'admin@admin.cz';
    DELETE FROM users WHERE email = 'admin@admin.cz';

    -- Vložíme nového uživatele do auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',  -- instance_id
        'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- id
        'authenticated',                          -- aud
        'authenticated',                          -- role
        'admin@admin.cz',                        -- email
        crypt('admin', gen_salt('bf')),          -- encrypted_password
        now(),                                   -- email_confirmed_at
        NULL,                                    -- invited_at
        '',                                      -- confirmation_token
        NULL,                                    -- confirmation_sent_at
        '',                                      -- recovery_token
        NULL,                                    -- recovery_sent_at
        '',                                      -- email_change_token_new
        '',                                      -- email_change
        NULL,                                    -- email_change_sent_at
        now(),                                   -- last_sign_in_at
        '{"provider": "email", "providers": ["email"]}'::jsonb,  -- raw_app_meta_data
        '{"name": "Jan Novák", "role": "doctor"}'::jsonb,        -- raw_user_meta_data
        false,                                   -- is_super_admin
        now(),                                   -- created_at
        now(),                                   -- updated_at
        NULL,                                    -- phone
        NULL,                                    -- phone_confirmed_at
        '',                                      -- phone_change
        '',                                      -- phone_change_token
        NULL,                                    -- phone_change_sent_at
        '',                                      -- email_change_token_current
        0,                                       -- email_change_confirm_status
        NULL,                                    -- banned_until
        '',                                      -- reauthentication_token
        NULL,                                    -- reauthentication_sent_at
        false,                                   -- is_sso_user
        NULL                                     -- deleted_at
    );

    -- Get the user id
    SELECT id INTO _user_id FROM auth.users WHERE email = 'admin@admin.cz';

    -- Vložíme uživatele do users tabulky
    INSERT INTO users (
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
        specialization,
        license_number,
        created_at,
        updated_at
    ) VALUES (
        _user_id,
        'Jan',
        'Novák',
        'admin@admin.cz',
        '+420777888999',
        'doctor',
        'Neurologie',
        'CZ12345',
        now(),
        now()
    );

    -- Nastavíme identitu pro users tabulku
    PERFORM setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
END $$;

-- Vložení 20 testovacích pacientů
INSERT INTO patients (
    id, doctor_id, medical_record_number, first_name, last_name, birth_date, gender, 
    email, phone, insurance_number, created_by, status, insurance_provider,
    insurance_status, blood_type, allergies, emergency_contact_name,
    emergency_contact_phone, medical_history, notes
)
SELECT 
    gen_random_uuid(),  -- ID
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- doctor_id (náš testovací lékař)
    'MRN' || LPAD(CAST(generate_series AS text), 3, '0'),  -- medical_record_number
    CASE (random() * 19)::integer
        WHEN 0 THEN 'Jan' WHEN 1 THEN 'Petr' WHEN 2 THEN 'Pavel' WHEN 3 THEN 'Martin'
        WHEN 4 THEN 'Tomáš' WHEN 5 THEN 'Jiří' WHEN 6 THEN 'Marie' WHEN 7 THEN 'Jana'
        WHEN 8 THEN 'Eva' WHEN 9 THEN 'Anna' WHEN 10 THEN 'Lucie' WHEN 11 THEN 'Kateřina'
        WHEN 12 THEN 'Michal' WHEN 13 THEN 'David' WHEN 14 THEN 'Jakub' WHEN 15 THEN 'Tereza'
        WHEN 16 THEN 'Veronika' WHEN 17 THEN 'Markéta' WHEN 18 THEN 'Lenka' ELSE 'Josef'
    END,  -- first_name
    CASE (random() * 14)::integer
        WHEN 0 THEN 'Novák' WHEN 1 THEN 'Svoboda' WHEN 2 THEN 'Novotný' WHEN 3 THEN 'Dvořák'
        WHEN 4 THEN 'Černý' WHEN 5 THEN 'Procházka' WHEN 6 THEN 'Kučera' WHEN 7 THEN 'Veselý'
        WHEN 8 THEN 'Horák' WHEN 9 THEN 'Němec' WHEN 10 THEN 'Marek' WHEN 11 THEN 'Pospíšil'
        WHEN 12 THEN 'Pokorný' WHEN 13 THEN 'Hájek' ELSE 'Král'
    END,  -- last_name
    (CURRENT_DATE - (random() * 365 * 70 + 365 * 18)::integer),  -- birth_date (18-88 let)
    CASE WHEN random() < 0.5 THEN 'male' ELSE 'female' END,  -- gender
    'patient' || generate_series || '@email.cz',  -- email
    '+420' || (700000000 + (random() * 99999999)::integer)::text,  -- phone
    (100000000 + (random() * 899999999)::integer)::text,  -- insurance_number
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- created_by
    'active',  -- status
    CASE (random() * 4)::integer
        WHEN 0 THEN 'VZP' WHEN 1 THEN 'ZPMV' WHEN 2 THEN 'OZP'
        WHEN 3 THEN 'ČPZP' ELSE 'VOZP'
    END,  -- insurance_provider
    'active',  -- insurance_status
    CASE (random() * 7)::integer
        WHEN 0 THEN 'A+' WHEN 1 THEN 'A-' WHEN 2 THEN 'B+' WHEN 3 THEN 'B-'
        WHEN 4 THEN 'AB+' WHEN 5 THEN 'AB-' WHEN 6 THEN 'O+' ELSE 'O-'
    END,  -- blood_type
    ARRAY[
        CASE WHEN random() < 0.3 THEN 'peanuts' END,
        CASE WHEN random() < 0.3 THEN 'penicillin' END,
        CASE WHEN random() < 0.3 THEN 'dust' END,
        CASE WHEN random() < 0.3 THEN 'pollen' END
    ],  -- allergies
    CASE (random() * 9)::integer
        WHEN 0 THEN 'Marie' WHEN 1 THEN 'Jan' WHEN 2 THEN 'Eva' WHEN 3 THEN 'Petr'
        WHEN 4 THEN 'Jana' WHEN 5 THEN 'Pavel' WHEN 6 THEN 'Anna' WHEN 7 THEN 'Josef'
        WHEN 8 THEN 'Hana' ELSE 'Karel'
    END || ' ' ||
    CASE (random() * 9)::integer
        WHEN 0 THEN 'Nováková' WHEN 1 THEN 'Svobodová' WHEN 2 THEN 'Novotná' WHEN 3 THEN 'Dvořáková'
        WHEN 4 THEN 'Černá' WHEN 5 THEN 'Procházková' WHEN 6 THEN 'Kučerová' WHEN 7 THEN 'Veselá'
        WHEN 8 THEN 'Horáková' ELSE 'Němcová'
    END,  -- emergency_contact_name
    '+420' || (700000000 + (random() * 99999999)::integer)::text,  -- emergency_contact_phone
    CASE (random() * 4)::integer
        WHEN 0 THEN 'Hypertenze'
        WHEN 1 THEN 'Diabetes typu 2'
        WHEN 2 THEN 'Astma'
        WHEN 3 THEN 'Artritida'
        ELSE 'Bez závažných onemocnění'
    END,  -- medical_history
    CASE WHEN random() < 0.5 
        THEN 'Pravidelné kontroly každé 3 měsíce' 
        ELSE 'Standardní preventivní prohlídky'
    END  -- notes
FROM generate_series(1, 20);

-- Vložení testovacích DICOM studií
INSERT INTO dicom_studies (
    id, patient_id, doctor_id, study_type, study_date, modality,
    description, thumbnail_url, full_study_url, file_size
)
SELECT 
    gen_random_uuid(),  -- id
    patient.id,  -- patient_id
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- doctor_id
    (CASE (random() * 3)::integer
        WHEN 0 THEN 'mri'::study_type
        WHEN 1 THEN 'ct'::study_type
        WHEN 2 THEN 'xray'::study_type
        ELSE 'ultrasound'::study_type
    END),  -- study_type
    CURRENT_DATE - (random() * 365)::integer,  -- study_date
    CASE (random() * 3)::integer
        WHEN 0 THEN 'MRI'
        WHEN 1 THEN 'CT'
        WHEN 2 THEN 'XRay'
        ELSE 'Ultrasound'
    END,  -- modality
    CASE (random() * 3)::integer
        WHEN 0 THEN 'Kontrolní vyšetření'
        WHEN 1 THEN 'Preventivní vyšetření'
        WHEN 2 THEN 'Diagnostické vyšetření'
        ELSE 'Akutní vyšetření'
    END,  -- description
    '/storage/thumbnails/study' || generate_series || '.jpg',  -- thumbnail_url
    '/storage/studies/study' || generate_series,  -- full_study_url
    (random() * 1000000 + 100000)::integer  -- file_size
FROM patients patient
CROSS JOIN generate_series(1, 2);  -- 2 studie pro každého pacienta

-- Vložení testovacích diagnóz
INSERT INTO diagnoses (
    id, patient_id, doctor_id, diagnosis_name, description, treatment_plan,
    status, diagnosis_date, icd_code, notes
)
SELECT 
    gen_random_uuid(),  -- id
    patient.id,  -- patient_id
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- doctor_id
    CASE (random() * 4)::integer
        WHEN 0 THEN 'Hypertenze'
        WHEN 1 THEN 'Diabetes mellitus'
        WHEN 2 THEN 'Osteoartróza'
        WHEN 3 THEN 'Astma bronchiale'
        ELSE 'Hypothyreóza'
    END,  -- diagnosis_name
    CASE (random() * 4)::integer
        WHEN 0 THEN 'Mírná forma'
        WHEN 1 THEN 'Středně těžká forma'
        WHEN 2 THEN 'Kompenzovaný stav'
        WHEN 3 THEN 'Akutní exacerbace'
        ELSE 'Pod kontrolou'
    END,  -- description
    CASE (random() * 4)::integer
        WHEN 0 THEN 'Farmakologická léčba'
        WHEN 1 THEN 'Režimová opatření'
        WHEN 2 THEN 'Pravidelné kontroly'
        WHEN 3 THEN 'Rehabilitace'
        ELSE 'Dietní opatření'
    END,  -- treatment_plan
    (CASE (random() * 2)::integer
        WHEN 0 THEN 'preliminary'::diagnosis_status
        WHEN 1 THEN 'confirmed'::diagnosis_status
        ELSE 'archived'::diagnosis_status
    END),  -- status
    CURRENT_DATE - (random() * 365)::integer,  -- diagnosis_date
    'ICD' || (random() * 89 + 10)::integer || '.' || (random() * 9)::integer,  -- icd_code
    CASE WHEN random() < 0.5 
        THEN 'Vyžaduje pravidelné kontroly' 
        ELSE 'Stabilizovaný stav'
    END  -- notes
FROM patients patient;

-- Vložení testovacích vyšetření
INSERT INTO appointments (
    id, patient_id, doctor_id, appointment_date, duration,
    status, appointment_type, reason, notes
)
SELECT 
    gen_random_uuid(),  -- id
    patient.id,  -- patient_id
    'a0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',  -- doctor_id
    CURRENT_DATE + (random() * 30)::integer,  -- appointment_date (v příštích 30 dnech)
    (CASE (random() * 2)::integer
        WHEN 0 THEN INTERVAL '30 minutes'
        WHEN 1 THEN INTERVAL '45 minutes'
        ELSE INTERVAL '60 minutes'
    END),  -- duration
    (CASE (random() * 3)::integer
        WHEN 0 THEN 'scheduled'::appointment_status
        WHEN 1 THEN 'completed'::appointment_status
        WHEN 2 THEN 'cancelled'::appointment_status
        ELSE 'no_show'::appointment_status
    END),  -- status
    CASE (random() * 3)::integer
        WHEN 0 THEN 'Kontrola'
        WHEN 1 THEN 'Konzultace'
        WHEN 2 THEN 'Preventivní prohlídka'
        ELSE 'Akutní vyšetření'
    END,  -- appointment_type
    CASE (random() * 3)::integer
        WHEN 0 THEN 'Pravidelná kontrola'
        WHEN 1 THEN 'Kontrola výsledků'
        WHEN 2 THEN 'Preventivní prohlídka'
        ELSE 'Akutní obtíže'
    END,  -- reason
    CASE WHEN random() < 0.5 
        THEN 'Přinést předchozí výsledky' 
        ELSE 'Standardní vyšetření'
    END  -- notes
FROM patients patient;
