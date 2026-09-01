using System.Text;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;
using GestaoClientesPedidos.Infrastructure.Data;
using GestaoClientesPedidos.Infrastructure.Repositories;
using GestaoClientesPedidos.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GestaoClientesPedidos.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Configuração do Banco de Dados (SQL Server com fallback para InMemory em desenvolvimento caso necessário)
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase");

        if (useInMemory || string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("GestaoClientesPedidosDb"));
        }
        else
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null);
                }));
        }

        // 2. Injeção de Dependências - Repositórios
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IClienteRepository, ClienteRepository>();
        services.AddScoped<IProdutoRepository, ProdutoRepository>();
        services.AddScoped<IPedidoRepository, PedidoRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        // 3. Injeção de Dependências - Serviços
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IProdutoService, ProdutoService>();
        services.AddScoped<IPedidoService, PedidoService>();
        services.AddScoped<IDashboardService, DashboardService>();

        // 4. Configuração de Autenticação JWT
        var secretKey = configuration["Jwt:Key"] ?? "MinhaChaveSuperSecretaDeAltaSegurancaParaGestaoClientesPedidos2026";
        var issuer = configuration["Jwt:Issuer"] ?? "GestaoClientesPedidos";
        var audience = configuration["Jwt:Audience"] ?? "GestaoClientesPedidosClient";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        // 5. Configuração de CORS para permitir SPA Frontend
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        return services;
    }
}
