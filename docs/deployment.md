# Deployment Guide

## Příprava Prostředí

### Požadavky
- Docker Engine 20.10+
- Docker Compose 2.0+
- SSL certifikát
- Doména pro aplikaci
- Přístup k produkčnímu serveru

### Produkční Server
Doporučené minimální specifikace:
- 4 CPU cores
- 8GB RAM
- 100GB SSD
- Ubuntu 20.04 LTS

## Konfigurace

1. SSL Certifikát
```bash
# Instalace Certbot
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

2. Environment Variables
```bash
# Kopírování a úprava .env souboru
cp .env.example .env.production
nano .env.production
```

Důležité proměnné k nastavení:
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `API_URL`
- `NODE_ENV=production`

3. Docker Compose
```yaml
# docker-compose.prod.yml
version: '3'
services:
  backend:
    image: your-registry/neuronalabs-backend:latest
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    volumes:
      - ./ssl:/ssl
    networks:
      - app-network

  frontend:
    image: your-registry/neuronalabs-frontend:latest
    restart: always
    depends_on:
      - backend
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./ssl:/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Deployment Process

1. Build Images
```bash
# Backend
docker build -t your-registry/neuronalabs-backend:latest -f docker/backend/Dockerfile .
docker push your-registry/neuronalabs-backend:latest

# Frontend
docker build -t your-registry/neuronalabs-frontend:latest -f docker/frontend/Dockerfile .
docker push your-registry/neuronalabs-frontend:latest
```

2. Server Setup
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. Deploy
```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Monitoring

1. Setup Application Insights
```bash
# Add connection string to environment variables
APPLICATION_INSIGHTS_CONNECTION_STRING=your-connection-string
```

2. Setup Sentry
```bash
# Add DSN to environment variables
SENTRY_DSN=your-sentry-dsn
```

3. Health Checks
```bash
# Backend health check
curl https://your-domain.com/health

# Frontend health check
curl https://your-domain.com
```

## Backup

1. Database Backup
```bash
# Automated daily backup
0 0 * * * docker exec neuronalabs-db pg_dump -U postgres neuronalabs > /backup/db_$(date +\%Y\%m\%d).sql
```

2. File Backup
```bash
# Backup uploaded files
0 0 * * * tar -czf /backup/files_$(date +\%Y\%m\%d).tar.gz /data/uploads
```

## Rollback

V případě problémů:

1. Rollback na předchozí verzi
```bash
# Pull previous version
docker-compose -f docker-compose.prod.yml pull your-registry/neuronalabs-backend:previous
docker-compose -f docker-compose.prod.yml pull your-registry/neuronalabs-frontend:previous

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

2. Database Rollback
```bash
# Restore from backup
cat backup.sql | docker exec -i neuronalabs-db psql -U postgres neuronalabs
```

## Security Checklist

- [ ] SSL certifikát je platný
- [ ] Všechny secrets jsou v .env souboru
- [ ] Firewall je nakonfigurován
- [ ] Databáze je zabezpečená
- [ ] Monitoring je aktivní
- [ ] Backupy jsou nastaveny
- [ ] Health checks fungují
