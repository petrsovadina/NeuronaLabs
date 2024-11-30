-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create enum types for various statuses
create type patient_status as enum ('active', 'inactive', 'archived');
create type appointment_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');
create type study_type as enum ('mri', 'ct', 'xray', 'ultrasound', 'other');
create type diagnosis_status as enum ('preliminary', 'confirmed', 'archived');
create type insurance_status as enum ('active', 'expired', 'pending');
create type user_role as enum ('admin', 'doctor', 'nurse', 'receptionist');

-- Create users table (extends Supabase auth.users)
create table users (
    id uuid references auth.users on delete cascade primary key,
    first_name text not null,
    last_name text not null,
    email text unique not null,
    phone text,
    role user_role not null default 'doctor',
    specialization text,
    license_number text,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create patients table
create table patients (
    id uuid default uuid_generate_v4() primary key,
    first_name text not null,
    last_name text not null,
    birth_date date not null,
    gender text,
    email text,
    phone text,
    address text,
    city text,
    postal_code text,
    country text default 'Czech Republic',
    status patient_status default 'active',
    insurance_provider text,
    insurance_number text,
    insurance_status insurance_status default 'active',
    blood_type text,
    allergies text[],
    emergency_contact_name text,
    emergency_contact_phone text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references users(id),
    updated_by uuid references users(id)
);

-- Create medical_history table
create table medical_history (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    condition_name text not null,
    diagnosis_date date,
    resolution_date date,
    is_chronic boolean default false,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references users(id),
    updated_by uuid references users(id)
);

-- Create appointments table
create table appointments (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    doctor_id uuid references users(id),
    appointment_date timestamptz not null,
    duration interval not null default interval '30 minutes',
    status appointment_status default 'scheduled',
    appointment_type text not null,
    reason text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    cancelled_reason text,
    cancelled_at timestamptz,
    cancelled_by uuid references users(id)
);

-- Create diagnoses table
create table diagnoses (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    appointment_id uuid references appointments(id),
    doctor_id uuid references users(id),
    icd_code text,
    diagnosis_name text not null,
    description text,
    status diagnosis_status default 'preliminary',
    diagnosis_date date not null default current_date,
    treatment_plan text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create medications table
create table medications (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    diagnosis_id uuid references diagnoses(id),
    prescribed_by uuid references users(id),
    medication_name text not null,
    dosage text not null,
    frequency text not null,
    start_date date not null,
    end_date date,
    is_active boolean default true,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create dicom_studies table
create table dicom_studies (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    appointment_id uuid references appointments(id),
    doctor_id uuid references users(id),
    study_type study_type not null,
    study_date timestamptz not null default now(),
    study_description text,
    file_path text not null,
    file_size bigint not null,
    metadata jsonb,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create lab_results table
create table lab_results (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    appointment_id uuid references appointments(id),
    doctor_id uuid references users(id),
    test_name text not null,
    test_date timestamptz not null,
    results jsonb not null,
    normal_range jsonb,
    is_abnormal boolean,
    notes text,
    file_path text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create vital_signs table
create table vital_signs (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references patients(id) on delete cascade,
    appointment_id uuid references appointments(id),
    recorded_by uuid references users(id),
    measurement_date timestamptz not null default now(),
    blood_pressure_systolic integer,
    blood_pressure_diastolic integer,
    heart_rate integer,
    respiratory_rate integer,
    temperature decimal(4,1),
    oxygen_saturation integer,
    height decimal(5,2),
    weight decimal(5,2),
    bmi decimal(4,1),
    notes text,
    created_at timestamptz default now()
);

-- Create notifications table
create table notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users(id) on delete cascade,
    title text not null,
    message text not null,
    type text not null,
    is_read boolean default false,
    created_at timestamptz default now()
);

-- Create audit_log table
create table audit_log (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users(id),
    action text not null,
    table_name text not null,
    record_id uuid not null,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    created_at timestamptz default now()
);

-- Create indexes for better query performance
create index idx_patients_name on patients(last_name, first_name);
create index idx_patients_insurance on patients(insurance_number);
create index idx_appointments_date on appointments(appointment_date);
create index idx_appointments_patient on appointments(patient_id);
create index idx_appointments_doctor on appointments(doctor_id);
create index idx_diagnoses_patient on diagnoses(patient_id);
create index idx_diagnoses_icd on diagnoses(icd_code);
create index idx_medications_patient on medications(patient_id);
create index idx_dicom_studies_patient on dicom_studies(patient_id);
create index idx_lab_results_patient on lab_results(patient_id);
create index idx_vital_signs_patient on vital_signs(patient_id);

-- Create RLS policies
alter table users enable row level security;
alter table patients enable row level security;
alter table medical_history enable row level security;
alter table appointments enable row level security;
alter table diagnoses enable row level security;
alter table medications enable row level security;
alter table dicom_studies enable row level security;
alter table lab_results enable row level security;
alter table vital_signs enable row level security;
alter table notifications enable row level security;
alter table audit_log enable row level security;

-- Create functions for automatic timestamp updates
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for automatic timestamp updates
create trigger update_patients_updated_at
    before update on patients
    for each row
    execute function update_updated_at();

create trigger update_medical_history_updated_at
    before update on medical_history
    for each row
    execute function update_updated_at();

create trigger update_appointments_updated_at
    before update on appointments
    for each row
    execute function update_updated_at();

create trigger update_diagnoses_updated_at
    before update on diagnoses
    for each row
    execute function update_updated_at();

create trigger update_medications_updated_at
    before update on medications
    for each row
    execute function update_updated_at();

create trigger update_dicom_studies_updated_at
    before update on dicom_studies
    for each row
    execute function update_updated_at();

create trigger update_lab_results_updated_at
    before update on lab_results
    for each row
    execute function update_updated_at();

-- Create audit log trigger function
create or replace function audit_trigger_func()
returns trigger as $$
begin
    insert into audit_log (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address
    )
    values (
        auth.uid(),
        tg_op,
        tg_table_name::text,
        coalesce(new.id, old.id),
        case when tg_op = 'DELETE' then to_jsonb(old) else null end,
        case when tg_op = 'INSERT' or tg_op = 'UPDATE' then to_jsonb(new) else null end,
        inet_client_addr()
    );
    return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Create audit triggers for main tables
create trigger audit_patients_trigger
    after insert or update or delete on patients
    for each row execute function audit_trigger_func();

create trigger audit_medical_history_trigger
    after insert or update or delete on medical_history
    for each row execute function audit_trigger_func();

create trigger audit_appointments_trigger
    after insert or update or delete on appointments
    for each row execute function audit_trigger_func();

create trigger audit_diagnoses_trigger
    after insert or update or delete on diagnoses
    for each row execute function audit_trigger_func();

create trigger audit_medications_trigger
    after insert or update or delete on medications
    for each row execute function audit_trigger_func();

create trigger audit_dicom_studies_trigger
    after insert or update or delete on dicom_studies
    for each row execute function audit_trigger_func();

create trigger audit_lab_results_trigger
    after insert or update or delete on lab_results
    for each row execute function audit_trigger_func();

-- Create function to automatically create a notification
create or replace function create_appointment_notification()
returns trigger as $$
begin
    if new.status = 'scheduled' then
        insert into notifications (
            user_id,
            title,
            message,
            type
        )
        values (
            new.doctor_id,
            'Nová rezervace',
            format('Nová rezervace pro pacienta dne %s', new.appointment_date),
            'appointment'
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for appointment notifications
create trigger appointment_notification_trigger
    after insert on appointments
    for each row execute function create_appointment_notification();
