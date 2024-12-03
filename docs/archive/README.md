# NeuronaLabs DICOM Backend

## 🏥 Project Overview
NeuronaLabs is an advanced DICOM metadata management and visualization platform designed for medical imaging professionals.

## 🚀 Features
- DICOM Study Management
- GraphQL API for Metadata Retrieval
- OHIF Viewer Integration
- Supabase Backend
- Robust Error Handling

## 🛠 Tech Stack
- .NET Core 8.0
- HotChocolate GraphQL
- Entity Framework Core
- Supabase
- fo-dicom Library

## 📦 Prerequisites
- .NET SDK 8.0
- Docker (optional, for containerization)
- Supabase Account

## 🔧 Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/NeuronaLabs/dicom-backend.git
cd dicom-backend
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your configuration
nano .env
```

### 3. Install Dependencies
```bash
dotnet restore
```

### 4. Database Migration
```bash
dotnet ef database update
```

### 5. Run the Application
```bash
dotnet run
```

## 🧪 Testing
```bash
dotnet test
```

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

## 🔐 Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase project API key
- `DICOM_STORAGE_PATH`: Local DICOM file storage path
- `ORTHANC_URL`: Orthanc DICOM server URL

## 📊 Performance Considerations
- Implement caching strategies
- Use asynchronous processing for large DICOM studies
- Monitor database query performance

## 🚨 Error Handling
- Comprehensive logging
- Graceful error responses
- Detailed error tracking

## 🔍 Monitoring and Observability
- Integrate Application Insights
- Implement distributed tracing
- Set up performance metrics

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License
MIT License

## 📞 Contact
- Project Lead: [Your Name]
- Email: support@neuronalabs.com

## 🛡️ Security
Please report security vulnerabilities privately to security@neuronalabs.com
