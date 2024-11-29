# Architektura NeuronaLabs

## Přehled

NeuronaLabs je postavena na moderní mikroservisní architektuře s odděleným frontendem a backendem. Aplikace je plně kontejnerizována pomocí Dockeru.

## Komponenty

### Frontend
- Single Page Application (SPA) v React.js
- OHIF Viewer pro DICOM zobrazování
- State management pomocí React Context a Hooks
- GraphQL client pro komunikaci s backendem
- Tailwind CSS pro styling

### Backend
- .NET 6.0 Web API
- GraphQL API (HotChocolate)
- Entity Framework Core pro ORM
- PostgreSQL databáze
- JWT autentizace

### Infrastruktura
- Docker kontejnery
- Nginx reverse proxy
- PostgreSQL databáze
- Redis cache (plánováno)

## Databázové Schéma

```
Patient
- Id (PK)
- Name
- DateOfBirth
- Gender
- LastDiagnosis
- CreatedAt
- UpdatedAt

DiagnosticData
- Id (PK)
- PatientId (FK)
- Type
- Data
- CreatedAt
- Metadata

DicomStudy
- Id (PK)
- PatientId (FK)
- StudyInstanceUID
- StudyDate
- Modality
- Description
```

## API Endpoints

GraphQL API poskytuje následující hlavní operace:

### Queries
- getPatient(id: ID!)
- getAllPatients
- getDiagnosticData(patientId: ID!)
- getDicomStudies(patientId: ID!)

### Mutations
- createPatient
- updatePatient
- deletePatient
- addDiagnosticData
- addDicomStudy

## Bezpečnost

- JWT autentizace pro API
- Role-based access control
- HTTPS/SSL
- Šifrování citlivých dat
- Rate limiting
- CORS politika

## Monitoring a Logging

- Application Insights
- Sentry pro error tracking
- Prometheus metriky (plánováno)
- Grafana dashboardy (plánováno)
- Strukturované logování

## Škálování

- Horizontální škálování pomocí Docker Swarm/Kubernetes (plánováno)
- Load balancing
- Caching strategie
- CDN pro statický obsah
