# Použití oficiálního .NET SDK image pro build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopírování projektu a obnovení závislostí
COPY *.csproj ./
RUN dotnet restore

# Kopírování zbytku zdrojových kódů
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Finální runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Nastavení proměnných prostředí
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

# Expozice portu
EXPOSE 80

# Spuštění aplikace
ENTRYPOINT ["dotnet", "NeuronaLabs.dll"]
