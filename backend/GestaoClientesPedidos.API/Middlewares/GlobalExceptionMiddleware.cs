using System.Net;
using System.Text.Json;
using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Exceptions;

namespace GestaoClientesPedidos.API.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocorreu um erro não tratado durante a requisição: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = HttpStatusCode.InternalServerError;
        var mensagem = "Ocorreu um erro interno no servidor. Tente novamente mais tarde.";
        List<string>? erros = null;

        switch (exception)
        {
            case NotFoundException notFoundEx:
                statusCode = HttpStatusCode.NotFound;
                mensagem = notFoundEx.Message;
                break;

            case BusinessException businessEx:
                statusCode = HttpStatusCode.UnprocessableEntity;
                mensagem = businessEx.Message;
                break;

            case UnauthorizedException unauthEx:
                statusCode = HttpStatusCode.Unauthorized;
                mensagem = unauthEx.Message;
                break;

            case ArgumentException argEx:
                statusCode = HttpStatusCode.BadRequest;
                mensagem = argEx.Message;
                break;

            default:
                // Log de erro interno
                mensagem = "Erro interno do servidor: " + exception.Message;
                break;
        }

        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Fail(mensagem, erros);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, jsonOptions);
        await context.Response.WriteAsync(json);
    }
}
