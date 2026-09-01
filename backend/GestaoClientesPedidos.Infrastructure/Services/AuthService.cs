using GestaoClientesPedidos.Core.DTOs.Auth;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ITokenService _tokenService;

    public AuthService(IUsuarioRepository usuarioRepository, ITokenService tokenService)
    {
        _usuarioRepository = usuarioRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.GetByEmailAsync(loginDto.Email, cancellationToken);
        if (usuario == null || !usuario.Ativo)
        {
            throw new UnauthorizedException("E-mail ou senha inválidos.");
        }

        bool isSenhaValida = BCrypt.Net.BCrypt.Verify(loginDto.Senha, usuario.SenhaHash);
        if (!isSenhaValida)
        {
            throw new UnauthorizedException("E-mail ou senha inválidos.");
        }

        var token = _tokenService.GenerateToken(usuario);
        var expiration = _tokenService.GetExpirationDate();

        return new AuthResponseDto
        {
            Token = token,
            ExpiraEm = expiration,
            Usuario = new UsuarioInfoDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Perfil = usuario.Perfil.ToString()
            }
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
    {
        var usuarioExistente = await _usuarioRepository.GetByEmailAsync(registerDto.Email, cancellationToken);
        if (usuarioExistente != null)
        {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail.");
        }

        var novoUsuario = new Usuario
        {
            Nome = registerDto.Nome.Trim(),
            Email = registerDto.Email.Trim().ToLower(),
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Senha),
            Perfil = registerDto.Perfil,
            Ativo = true
        };

        var usuarioCriado = await _usuarioRepository.AddAsync(novoUsuario, cancellationToken);
        var token = _tokenService.GenerateToken(usuarioCriado);
        var expiration = _tokenService.GetExpirationDate();

        return new AuthResponseDto
        {
            Token = token,
            ExpiraEm = expiration,
            Usuario = new UsuarioInfoDto
            {
                Id = usuarioCriado.Id,
                Nome = usuarioCriado.Nome,
                Email = usuarioCriado.Email,
                Perfil = usuarioCriado.Perfil.ToString()
            }
        };
    }
}
