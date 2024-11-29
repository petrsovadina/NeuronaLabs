# Development Guide

## Přehled Architektury

NeuronaLabs je postavený na mikroservisní architektuře s následujícími hlavními komponentami:

### Backend
- .NET 6.0 API
- GraphQL endpoint
- Entity Framework Core
- PostgreSQL databáze
- DICOM server integrace

### Frontend
- React 18 s Next.js
- TypeScript
- GraphQL klient
- Zustand pro state management
- Tailwind CSS pro styling

## Lokální Vývoj

### Prerekvizity
- .NET 6.0 SDK
- Node.js 16+
- Docker a Docker Compose
- PostgreSQL 13+
- Git

### První Spuštění

1. Klonování repozitáře:
```bash
git clone https://github.com/your-org/neuronalabs.git
cd neuronalabs
```

2. Backend setup:
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

3. Frontend setup:
```bash
cd frontend
npm install
npm run dev
```

4. Spuštění databáze:
```bash
docker-compose up -d db
```

### Vývojové Prostředí

#### VS Code Extensions
- C# for Visual Studio Code
- GraphQL
- ESLint
- Prettier
- Docker
- PostgreSQL

#### Debugging
1. Backend debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/backend/bin/Debug/net6.0/NeuronaLabs.dll",
      "args": [],
      "cwd": "${workspaceFolder}/backend",
      "stopAtEntry": false,
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

2. Frontend debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## Testování

### Backend Testy

1. Unit testy:
```bash
cd backend
dotnet test
```

2. GraphQL testy:
```bash
cd backend/Tests/GraphQL
dotnet test
```

### Frontend Testy

1. Unit testy:
```bash
cd frontend
npm test
```

2. E2E testy:
```bash
npm run test:e2e
```

## GraphQL API

### Queries
```graphql
query GetPatients {
  patients {
    id
    name
    dateOfBirth
    gender
    lastDiagnosis
  }
}

query GetPatient($id: ID!) {
  patient(id: $id) {
    id
    name
    diagnosticData {
      id
      type
      data
    }
    dicomStudies {
      studyInstanceUid
      modality
      studyDate
    }
  }
}
```

### Mutations
```graphql
mutation CreatePatient($input: PatientInput!) {
  createPatient(input: $input) {
    id
    name
  }
}

mutation AddDiagnosticData($input: DiagnosticDataInput!) {
  addDiagnosticData(input: $input) {
    id
    type
    data
  }
}
```

## State Management

### Zustand Store
```typescript
interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
}

const usePatientsStore = create<PatientsState>((set) => ({
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
}));
```

## Coding Standards

### Backend
- Použití async/await místo callbacks
- Repository pattern pro data access
- Dependency injection
- XML dokumentace pro public API
- Unit testy pro business logiku

### Frontend
- Funkcionální komponenty s hooks
- TypeScript pro type safety
- CSS-in-JS nebo Tailwind pro styling
- Jest a React Testing Library pro testy
- ESLint a Prettier pro formatting

## Deployment

### Staging
```bash
# Build a push Docker images
docker-compose -f docker-compose.staging.yml build
docker-compose -f docker-compose.staging.yml push

# Deploy na staging
ssh staging "cd /opt/neuronalabs && docker-compose pull && docker-compose up -d"
```

### Production
```bash
# Build a push Docker images
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push

# Deploy na production
ssh production "cd /opt/neuronalabs && docker-compose pull && docker-compose up -d"
```

## Monitoring a Logging

### Application Insights
```csharp
services.AddApplicationInsightsTelemetry(Configuration["APPINSIGHTS_CONNECTIONSTRING"]);
```

### Sentry
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Continuous Integration

GitHub Actions workflow provádí:
1. Build a testy
2. Security scan
3. Docker build
4. Deployment na staging/production

## Best Practices

1. Security
- HTTPS všude
- JWT autentizace
- Input validace
- CORS policy
- Security headers

2. Performance
- API caching
- Image optimalizace
- Code splitting
- Lazy loading

3. Code Quality
- Code reviews
- Automated testing
- Static code analysis
- Regular dependency updates

## Troubleshooting

### Common Issues

1. Database Connection
```bash
# Check PostgreSQL logs
docker-compose logs db

# Check connection string
dotnet user-secrets list
```

2. DICOM Server
```bash
# Check DICOM server status
curl http://localhost:8042/health

# Check DICOM logs
docker-compose logs dicom
```

3. Frontend Build
```bash
# Clear cache
npm clean-cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Contributing

1. Branch naming:
- feature/feature-name
- bugfix/bug-description
- hotfix/urgent-fix

2. Commit messages:
- feat: new feature
- fix: bug fix
- docs: documentation
- test: adding tests
- refactor: code refactoring

3. Pull Request process:
- Create feature branch
- Write tests
- Update documentation
- Create PR
- Code review
- Merge after approval
