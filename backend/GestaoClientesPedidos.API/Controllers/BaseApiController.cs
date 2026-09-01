using GestaoClientesPedidos.Core.DTOs.Common;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected IActionResult CustomResponse<T>(T dados, string? mensagem = null)
    {
        return Ok(ApiResponse<T>.Ok(dados, mensagem));
    }

    protected IActionResult CustomCreatedResponse<T>(string actionName, object routeValues, T dados, string? mensagem = "Recurso criado com sucesso.")
    {
        return CreatedAtAction(actionName, routeValues, ApiResponse<T>.Ok(dados, mensagem));
    }

    protected IActionResult CustomNoContent(string? mensagem = "Operação realizada com sucesso.")
    {
        return Ok(ApiResponse<object?>.Ok(null, mensagem));
    }
}
