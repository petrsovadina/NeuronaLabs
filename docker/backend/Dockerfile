FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Kopírování csproj a obnovení jako oddělené vrstvy
COPY *.csproj ./
RUN dotnet restore

# Kopírování všeho ostatního a build
COPY . ./
RUN dotnet publish -c Release -o out

# Install EF Core tools
RUN apt-get update \
    && apt-get install -y curl \
    && curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0 \
    && dotnet tool install --global dotnet-ef

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
COPY --from=build-env /root/.dotnet/tools /root/.dotnet/tools

ENV PATH="${PATH}:/root/.dotnet/tools"

ENTRYPOINT ["dotnet", "NeuronaLabs.dll"]
