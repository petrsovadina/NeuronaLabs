# NeuronaLabs Medical Imaging Platform

## 🏥 Project Overview
NeuronaLabs is a comprehensive medical imaging and patient management platform designed to streamline healthcare data visualization and management.

## 🚀 Technology Stack
- **Frontend**: React, Next.js, OHIF Viewer
- **Backend**: .NET Core, GraphQL (HotChocolate)
- **Database**: Supabase (PostgreSQL)
- **DICOM Management**: Orthanc DICOM Server
- **Containerization**: Docker, Docker Compose

## 🔧 System Architecture
### Microservices Components
1. **Frontend Service**
   - React-based user interface
   - DICOM image visualization
   - GraphQL client

2. **Backend Service**
   - GraphQL API
   - Business logic processing
   - Authentication management

3. **Database Service**
   - Supabase PostgreSQL
   - User and patient data storage
   - Row Level Security

4. **DICOM Service**
   - Orthanc DICOM server
   - Medical image storage and retrieval

## 🛠 Prerequisites
- .NET Core 7.0+
- Node.js 16+
- Docker
- Docker Compose

## 🚦 Quick Start

### Development Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/neuronalabs.git
cd neuronalabs
```

2. Configure Environment
```bash
cp .env.example .env
# Update .env with your configuration
```

3. Start Services
```bash
docker-compose up --build
```

## 🔐 Authentication
- Default Test User
  - Email: admin@admin.cz
  - Password: admin12345
  - Role: doctor

## 📦 Key Features
- Patient management
- DICOM image visualization
- Secure authentication
- Role-based access control

## 🧪 Testing
- Unit tests for backend
- Integration tests
- GraphQL schema validation

## 🚧 Current Development Status
- [x] Basic project structure
- [x] Supabase configuration
- [ ] Complete GraphQL schema
- [ ] OHIF Viewer integration
- [ ] Comprehensive testing

## 📝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
[Your License Here]

## 🤝 Support
For support, please open an issue in the GitHub repository.
