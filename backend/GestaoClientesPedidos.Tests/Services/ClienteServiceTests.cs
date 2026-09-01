using System.Linq.Expressions;
using FluentAssertions;
using GestaoClientesPedidos.Core.DTOs.Clientes;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Services;
using Moq;
using Xunit;

namespace GestaoClientesPedidos.Tests.Services;

public class ClienteServiceTests
{
    private readonly Mock<IClienteRepository> _clienteRepositoryMock;
    private readonly ClienteService _clienteService;

    public ClienteServiceTests()
    {
        _clienteRepositoryMock = new Mock<IClienteRepository>();
        _clienteService = new ClienteService(_clienteRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ComDocumentoExistente_DeveLancarBusinessException()
    {
        // Arrange
        _clienteRepositoryMock
            .Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<Cliente, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var dto = new CreateClienteDto
        {
            Nome = "Empresa Teste",
            Email = "teste@empresa.com",
            Documento = "12.345.678/0001-99",
            Telefone = "11999999999"
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _clienteService.CreateAsync(dto));
        ex.Message.Should().Contain("Já existe um cliente cadastrado com este CPF/CNPJ");
    }

    [Fact]
    public async Task CreateAsync_ComDadosValidos_DeveCriarClienteComSucesso()
    {
        // Arrange
        _clienteRepositoryMock
            .Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<Cliente, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _clienteRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Cliente>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Cliente c, CancellationToken ct) =>
            {
                c.Id = 10;
                c.CriadoEm = DateTime.UtcNow;
                return c;
            });

        var dto = new CreateClienteDto
        {
            Nome = "Empresa Valida",
            Email = "contato@valida.com",
            Documento = "12345678909",
            Telefone = "11999999999"
        };

        // Act
        var result = await _clienteService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(10);
        result.Nome.Should().Be("Empresa Valida");
        result.Email.Should().Be("contato@valida.com");
    }

    [Fact]
    public async Task GetByIdAsync_QuandoNaoExiste_DeveLancarNotFoundException()
    {
        // Arrange
        _clienteRepositoryMock
            .Setup(r => r.GetWithPedidosAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Cliente?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _clienteService.GetByIdAsync(999));
    }

    [Fact]
    public async Task DeleteAsync_ComPedidosVinculados_DeveLancarBusinessException()
    {
        // Arrange
        var cliente = new Cliente
        {
            Id = 1,
            Nome = "Cliente com Pedido",
            Pedidos = new List<Pedido> { new Pedido { Id = 100 } }
        };

        _clienteRepositoryMock
            .Setup(r => r.GetWithPedidosAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(cliente);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _clienteService.DeleteAsync(1));
        ex.Message.Should().Contain("possui pedidos vinculados");
    }
}
