# Použití oficiálního .NET SDK image pro build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Kopírování projektu a obnovení závislostí
COPY backend/NeuronaLabs.csproj ./
RUN dotnet restore

# Kopírování zbytku zdrojových kódů
COPY backend/ ./
RUN dotnet publish -c Release -o /app/publish

# Finální runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Instalace dalších závislostí
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Kopírování publikovaných artefaktů
COPY --from=build /app/publish .

# Nastavení proměnných prostředí
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

# Expozice portu
EXPOSE 5000

# Nastavení kontroly stavu
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s \
  CMD curl -f http://localhost:5000/health || exit 1

# Spuštění aplikace
ENTRYPOINT ["dotnet", "NeuronaLabs.dll"]
