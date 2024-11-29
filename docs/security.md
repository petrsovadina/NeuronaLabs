# Security Guide

## Přehled Zabezpečení

NeuronaLabs implementuje vícevrstvý přístup k zabezpečení pro ochranu citlivých zdravotnických dat.

## Autentizace a Autorizace

### JWT Autentizace
- Secure token generation
- Token expiration
- Refresh token mechanismus
- Secure cookie storage

### Role-Based Access Control (RBAC)
Role:
- Admin
- Doctor
- Nurse
- Patient
- Technician

Oprávnění:
- READ_PATIENT
- WRITE_PATIENT
- READ_DICOM
- WRITE_DICOM
- ADMIN_ACCESS

## Zabezpečení Dat

### Šifrování
- SSL/TLS pro přenos dat
- Šifrování citlivých dat v databázi
- Secure key management
- Perfect Forward Secrecy

### DICOM Security
- DICOM TLS
- Access control lists
- Audit logging
- Data anonymization

## API Security

### Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

### CORS Policy
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

### Headers Security
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Database Security

### Connection Security
- SSL/TLS pro databázové spojení
- Připojení pouze z interní sítě
- Silné hesla
- Pravidelná rotace credentials

### Data Protection
- Šifrování citlivých sloupců
- Row-level security
- Audit logging
- Backup encryption

## Infrastructure Security

### Docker Security
```dockerfile
# Nonroot user
USER node

# Security options
SECURITY_OPTS="--security-opt=no-new-privileges:true"

# Read-only root filesystem
VOLUME ["/tmp", "/var/run"]
```

### Network Security
- Segmentace sítě
- Firewall rules
- VPN pro vzdálený přístup
- Regular security scans

## Monitoring a Audit

### Security Logging
- Access logs
- Error logs
- Audit trails
- Security events

### Monitoring
- Real-time security alerts
- Performance monitoring
- Error tracking
- Health checks

## Security Checklist

### Deployment
- [ ] SSL certifikáty jsou platné
- [ ] Všechny secrets jsou v .env
- [ ] Firewall je nakonfigurován
- [ ] Rate limiting je aktivní
- [ ] CORS je správně nastaven

### Data
- [ ] Databáze je zabezpečená
- [ ] Šifrování je aktivní
- [ ] Backupy jsou šifrované
- [ ] Access logs jsou aktivní

### Monitoring
- [ ] Security monitoring je aktivní
- [ ] Alerts jsou nastaveny
- [ ] Audit logging běží
- [ ] Error tracking je funkční

## Security Updates

1. Pravidelné aktualizace
```bash
# Update systému
apt-get update && apt-get upgrade

# Update Docker images
docker-compose pull
docker-compose up -d
```

2. Dependency Updates
```bash
# Frontend
npm audit
npm update

# Backend
dotnet restore
dotnet list package --outdated
```

## Incident Response

1. Security Incident Detection
- Monitoring alerts
- Log analysis
- User reports

2. Incident Response Steps
- Isolate affected systems
- Investigate root cause
- Apply fixes
- Update security measures

3. Recovery
- Restore from clean backups
- Verify system integrity
- Update security documentation
- Conduct post-mortem

## Compliance

- HIPAA compliance
- GDPR compliance
- Local healthcare regulations
- Regular security audits
