# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file and restore as distinct layers
COPY ["ProductManager.sln", "."]
COPY ["src/ProductManager.API/ProductManager.API.csproj", "src/ProductManager.API/"]
COPY ["src/ProductManager.Application/ProductManager.Application.csproj", "src/ProductManager.Application/"]
COPY ["src/ProductManager.Domain/ProductManager.Domain.csproj", "src/ProductManager.Domain/"]
COPY ["src/ProductManager.Infrastructure/ProductManager.Infrastructure.csproj", "src/ProductManager.Infrastructure/"]
COPY ["tests/ProductManager.Application.UnitTests/ProductManager.Application.UnitTests.csproj", "tests/ProductManager.Application.UnitTests/"]

# Restore packages
RUN dotnet restore "ProductManager.sln"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/ProductManager.API"
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProductManager.API.dll"]