-- Seed data pro testovací účely

-- Vložení testovacích uživatelů
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data)
VALUES 
    ('d0d4e39c-4f1a-4d22-8293-7b4ff17b5e69', 'dr.novak@neuronalabs.cz', crypt('heslo123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}'),
    ('e1d5f49d-5f2b-5d33-9394-8b5ff28b6f70', 'dr.svoboda@neuronalabs.cz', crypt('heslo123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}');

INSERT INTO users (id, first_name, last_name, email, phone, role, specialization, license_number)
VALUES
    ('d0d4e39c-4f1a-4d22-8293-7b4ff17b5e69', 'Jan', 'Novák', 'dr.novak@neuronalabs.cz', '+420777888999', 'doctor', 'Neurologie', 'CZ12345'),
    ('e1d5f49d-5f2b-5d33-9394-8b5ff28b6f70', 'Marie', 'Svobodová', 'dr.svoboda@neuronalabs.cz', '+420777888000', 'admin', 'Radiologie', 'CZ67890');

-- Vložení testovacích pacientů
INSERT INTO patients (id, first_name, last_name, birth_date, gender, email, phone, insurance_number, created_by)
VALUES
    ('f2d6e59e-6f3c-6d44-0495-9c6ff39c7f71', 'Petr', 'Černý', '1980-05-15', 'M', 'petr@email.cz', '+420777666555', '123456789', 'd0d4e39c-4f1a-4d22-8293-7b4ff17b5e69'),
    ('93d7e69f-7f4d-7d55-1596-0d7ff40d8f72', 'Jana', 'Bílá', '1990-08-20', 'F', 'jana@email.cz', '+420777666444', '987654321', 'e1d5f49d-5f2b-5d33-9394-8b5ff28b6f70');

-- Vložení testovacích DICOM studií
INSERT INTO dicom_studies (
    id, patient_id, doctor_id, study_type, study_date, 
    study_description, file_path, file_size
)
VALUES
    ('84d8e39c-8f5e-4d66-8697-1e8ff51e9f73', 
    'f2d6e59e-6f3c-6d44-0495-9c6ff39c7f71', 
    'd0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'mri',
    '2023-01-15 10:00:00',
    'MRI mozku', 
    '/storage/studies/study1',
    1024000
    ),
    ('95d9e89f-9f6f-4d77-9798-2f9ff62f0f74',
    '93d7e69f-7f4d-7d55-1596-0d7ff40d8f72',
    'e1d5f49d-5f2b-5d33-9394-8b5ff28b6f70',
    'ct',
    '2023-02-20 14:30:00',
    'CT páteře',
    '/storage/studies/study2',
    512000
    );

-- Vložení testovacích diagnóz
INSERT INTO diagnoses (
    id, patient_id, doctor_id, diagnosis_name, description, treatment_plan
)
VALUES
    ('a8d2e12c-2f9a-4d00-9001-5f2ff95f3f77',
    '93d7e69f-7f4d-7d55-1596-0d7ff40d8f72',
    'e1d5f49d-5f2b-5d33-9394-8b5ff28b6f70',
    'Degenerativní změny páteře',
    'Nalezeny degenerativní změny v oblasti L4-L5',
    'Doporučena rehabilitace a kontrola za 6 měsíců'
    );

-- Vložení testovacích záznamů do audit logu
INSERT INTO audit_log (
    user_id, action, table_name, record_id, new_values
)
VALUES
    ('d0d4e39c-4f1a-4d22-8293-7b4ff17b5e69',
    'CREATE',
    'patients',
    'f2d6e59e-6f3c-6d44-0495-9c6ff39c7f71',
    '{"first_name": "Petr", "last_name": "Černý"}'
    );
