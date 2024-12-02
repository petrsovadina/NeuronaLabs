# NeuronaLabs GraphQL API Dokumentace

## 🚀 Úvod
Tato dokumentace popisuje GraphQL API pro NeuronaLabs Healthcare Platform.

## 🔐 Autentizace
Všechny dotazy vyžadují platný JWT token v hlavičce `Authorization`.

### Autentizační Schéma
```graphql
type AuthResult {
  token: String!
  user: User!
  expiresAt: DateTime!
}

mutation {
  login(email: String!, password: String!): AuthResult
  register(input: UserRegistrationInput!): AuthResult
}
```

## 📋 Pacienti

### Dotazy
```graphql
# Načtení seznamu pacientů
query GetPatients(
  $search: String, 
  $offset: Int, 
  $limit: Int, 
  $orderBy: PatientOrderBy
): [Patient]

# Detail pacienta
query GetPatient($id: ID!): Patient
```

### Mutace
```graphql
# Vytvoření pacienta
mutation CreatePatient(input: CreatePatientInput!): Patient

# Aktualizace pacienta
mutation UpdatePatient(id: ID!, input: UpdatePatientInput!): Patient

# Smazání pacienta
mutation DeletePatient(id: ID!): Boolean
```

## 🩺 DICOM Studie

### Dotazy
```graphql
# Načtení DICOM studií
query GetDicomStudies(
  $patientId: ID, 
  $modality: Modality, 
  $status: StudyStatus,
  $fromDate: DateTime,
  $toDate: DateTime
): [DicomStudy]

# Detail DICOM studie
query GetDicomStudy($id: ID!): DicomStudy
```

### Mutace
```graphql
# Nahrání DICOM studie
mutation UploadDicomStudy(
  $patientId: ID!
  $dicomFile: Upload!
  $studyDescription: String
  $modality: Modality!
): DicomStudy

# Smazání DICOM studie
mutation DeleteDicomStudy($studyId: ID!): Boolean
```

## 📊 Diagnózy

### Dotazy
```graphql
# Načtení diagnóz pacienta
query GetPatientDiagnoses($patientId: ID!): [Diagnosis]
```

### Mutace
```graphql
# Vytvoření diagnózy
mutation CreateDiagnosis(input: CreateDiagnosisInput!): Diagnosis
```

## 🔍 Příklady

### Načtení pacientů
```graphql
query {
  patients(search: "Novák", limit: 10) {
    id
    firstName
    lastName
    birthDate
    diagnoses {
      id
      diagnosisText
      diagnosisDate
    }
  }
}
```

### Nahrání DICOM studie
```graphql
mutation {
  uploadDicomStudy(
    patientId: "123e4567-e89b-12d3-a456-426614174000"
    dicomFile: $file
    studyDescription: "MRI Brain Scan"
    modality: MRI
  ) {
    id
    orthancServerId
    studyDate
    modality
  }
}
```

## 🛡️ Chybové Stavy
- `UNAUTHORIZED`: Chyba autentizace
- `FORBIDDEN`: Nedostatečná oprávnění
- `NOT_FOUND`: Zdroj nenalezen
- `VALIDATION_ERROR`: Chyba validace dat

## 📦 Verze API
- Aktuální verze: 1.0.0
- Podpora: GraphQL v15
- Minimální požadovaná verze: HotChocolate 13.0.0

## 🌐 Endpointy
- Produkční GraphQL: `/graphql`
- GraphQL Playground: `/graphql/playground`
- GraphQL Dokumentace: `/graphql/docs`
