FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia arquivos csproj e restaura dependências
COPY ["GestaoClientesPedidos.sln", "./"]
COPY ["GestaoClientesPedidos.Core/GestaoClientesPedidos.Core.csproj", "GestaoClientesPedidos.Core/"]
COPY ["GestaoClientesPedidos.Infrastructure/GestaoClientesPedidos.Infrastructure.csproj", "GestaoClientesPedidos.Infrastructure/"]
COPY ["GestaoClientesPedidos.API/GestaoClientesPedidos.API.csproj", "GestaoClientesPedidos.API/"]
COPY ["GestaoClientesPedidos.Tests/GestaoClientesPedidos.Tests.csproj", "GestaoClientesPedidos.Tests/"]

RUN dotnet restore "GestaoClientesPedidos.sln"

# Copia todo o código fonte e compila
COPY . .
WORKDIR "/src/GestaoClientesPedidos.API"
RUN dotnet publish "GestaoClientesPedidos.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagem final de runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "GestaoClientesPedidos.API.dll"]
