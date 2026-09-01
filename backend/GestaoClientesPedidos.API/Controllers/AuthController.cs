using GestaoClientesPedidos.Core.DTOs.Auth;
using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Realiza autenticação de usuário e retorna o Token JWT.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto, CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(loginDto, cancellationToken);
        return CustomResponse(response, "Login realizado com sucesso!");
    }

    /// <summary>
    /// Cadastra um novo usuário no sistema.
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterAsync(registerDto, cancellationToken);
        return CustomResponse(response, "Usuário cadastrado com sucesso!");
    }
}
