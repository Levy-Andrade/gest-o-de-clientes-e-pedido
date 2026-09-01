using Microsoft.OpenApi.Models;

namespace GestaoClientesPedidos.API.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Gestão de Clientes e Pedidos API",
                Version = "v1",
                Description = "API RESTful profissional para gerenciamento de clientes, catálogo de produtos, pedidos de venda e métricas para dashboard.",
                Contact = new OpenApiContact
                {
                    Name = "Levy Dev - Full Stack Engineer",
                    Email = "contato@levydev.com"
                }
            });

            // Configuração do JWT Bearer no Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Insira o token JWT no formato: Bearer {seu_token}",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}
