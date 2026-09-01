using FluentAssertions;
using GestaoClientesPedidos.Core.DTOs.Auth;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;
using GestaoClientesPedidos.Infrastructure.Services;
using Moq;
using Xunit;

namespace GestaoClientesPedidos.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUsuarioRepository> _usuarioRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _usuarioRepositoryMock = new Mock<IUsuarioRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        _authService = new AuthService(_usuarioRepositoryMock.Object, _tokenServiceMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ComCredenciaisValidas_DeveRetornarTokenComSucesso()
    {
        // Arrange
        var senhaPura = "SenhaForte@123";
        var senhaHash = BCrypt.Net.BCrypt.HashPassword(senhaPura);
        var usuario = new Usuario
        {
            Id = 1,
            Nome = "Test User",
            Email = "teste@gestao.com",
            SenhaHash = senhaHash,
            Perfil = PerfilUsuario.Administrador,
            Ativo = true
        };

        _usuarioRepositoryMock
            .Setup(r => r.GetByEmailAsync(usuario.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _tokenServiceMock
            .Setup(t => t.GenerateToken(usuario))
            .Returns("token-jwt-fake-123");

        _tokenServiceMock
            .Setup(t => t.GetExpirationDate())
            .Returns(DateTime.UtcNow.AddHours(8));

        var loginDto = new LoginDto
        {
            Email = "teste@gestao.com",
            Senha = senhaPura
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().Be("token-jwt-fake-123");
        result.Usuario.Email.Should().Be("teste@gestao.com");
        result.Usuario.Nome.Should().Be("Test User");
    }

    [Fact]
    public async Task LoginAsync_ComEmailInexistente_DeveLancarUnauthorizedException()
    {
        // Arrange
        _usuarioRepositoryMock
            .Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        var loginDto = new LoginDto
        {
            Email = "naoexiste@gestao.com",
            Senha = "123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => _authService.LoginAsync(loginDto));
    }

    [Fact]
    public async Task LoginAsync_ComSenhaIncorreta_DeveLancarUnauthorizedException()
    {
        // Arrange
        var usuario = new Usuario
        {
            Id = 1,
            Email = "teste@gestao.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("SenhaCorreta@123"),
            Ativo = true
        };

        _usuarioRepositoryMock
            .Setup(r => r.GetByEmailAsync(usuario.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        var loginDto = new LoginDto
        {
            Email = "teste@gestao.com",
            Senha = "SenhaErrada@999"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(() => _authService.LoginAsync(loginDto));
    }

    [Fact]
    public async Task RegisterAsync_ComEmailDuplicado_DeveLancarBusinessException()
    {
        // Arrange
        var usuarioExistente = new Usuario
        {
            Id = 1,
            Email = "duplicado@gestao.com"
        };

        _usuarioRepositoryMock
            .Setup(r => r.GetByEmailAsync("duplicado@gestao.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuarioExistente);

        var registerDto = new RegisterDto
        {
            Nome = "Novo Usuario",
            Email = "duplicado@gestao.com",
            Senha = "Senha@123"
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _authService.RegisterAsync(registerDto));
        ex.Message.Should().Contain("Já existe um usuário cadastrado com este e-mail");
    }
}
