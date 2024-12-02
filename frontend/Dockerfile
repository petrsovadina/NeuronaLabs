# Použití Node.js LTS image pro build
FROM node:20-alpine AS build

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování package souborů
COPY package*.json ./

# Instalace závislostí
RUN npm ci

# Kopírování zdrojových kódů
COPY . .

# Build Next.js aplikace
RUN npm run build

# Produkční image
FROM node:20-alpine AS production

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování build souborů
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

# Instalace produkčních závislostí
RUN npm ci --only=production

# Nastavení proměnných prostředí
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:80
ENV NEXT_PUBLIC_OHIF_URL=http://ohif:3000

# Expozice portu
EXPOSE 3000

# Spuštění Next.js aplikace
CMD ["npm", "start"]
