using System.Text.Json.Serialization;
using GestaoClientesPedidos.API.Extensions;
using GestaoClientesPedidos.API.Middlewares;
using GestaoClientesPedidos.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração de Controllers com suporte a Enum como String e ciclo de referências ignorado
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Injeção de dependências personalizadas
builder.Services.AddApplicationServices(builder.Configuration);

// Configuração do Swagger OpenAPI com suporte a JWT Bearer
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// Execução de migrações / Seeding do Banco de Dados na inicialização
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await DbInitializer.InitializeAsync(context);
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Banco de dados inicializado e populado com sucesso.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao inicializar o banco de dados.");
    }
}

// Middleware Global de Tratamento de Exceções (RFC 7807)
app.UseMiddleware<GlobalExceptionMiddleware>();

// Ativação do Swagger para qualquer ambiente
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestão de Clientes e Pedidos API v1");
    c.RoutePrefix = string.Empty; // Define o Swagger na raiz http://localhost:5000/
    c.DocumentTitle = "Gestão de Clientes e Pedidos - Documentação da API";
});

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
