#!/bin/bash

echo "Kontrola služeb NeuronaLabs..."

# Kontrola backend API
echo -n "Kontrola Backend API (http://localhost:5000/health): "
if curl -s -f http://localhost:5000/health > /dev/null; then
    echo "✅ OK"
else
    echo "❌ Nedostupné"
fi

# Kontrola frontend
echo -n "Kontrola Frontend (http://localhost:3000): "
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ Nedostupné"
fi

# Kontrola GraphQL endpoint
echo -n "Kontrola GraphQL endpoint (http://localhost:5000/graphql): "
if curl -s -f http://localhost:5000/graphql > /dev/null; then
    echo "✅ OK"
else
    echo "❌ Nedostupné"
fi

# Kontrola Docker kontejnerů
echo -e "\nKontrola Docker kontejnerů:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Kontrola logů pro chyby
echo -e "\nKontrola logů za posledních 5 minut pro chyby:"
docker-compose logs --tail=50 | grep -i "error"

echo -e "\nKontrola dokončena!"
