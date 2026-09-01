using FluentAssertions;
using GestaoClientesPedidos.Core.DTOs.Pedidos;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Services;
using Moq;
using Xunit;

namespace GestaoClientesPedidos.Tests.Services;

public class PedidoServiceTests
{
    private readonly Mock<IPedidoRepository> _pedidoRepositoryMock;
    private readonly Mock<IClienteRepository> _clienteRepositoryMock;
    private readonly Mock<IProdutoRepository> _produtoRepositoryMock;
    private readonly PedidoService _pedidoService;

    public PedidoServiceTests()
    {
        _pedidoRepositoryMock = new Mock<IPedidoRepository>();
        _clienteRepositoryMock = new Mock<IClienteRepository>();
        _produtoRepositoryMock = new Mock<IProdutoRepository>();
        _pedidoService = new PedidoService(_pedidoRepositoryMock.Object, _clienteRepositoryMock.Object, _produtoRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ComClienteInativo_DeveLancarBusinessException()
    {
        // Arrange
        var clienteInativo = new Cliente
        {
            Id = 1,
            Nome = "Cliente Inativo",
            Ativo = false
        };

        _clienteRepositoryMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(clienteInativo);

        var dto = new CreatePedidoDto
        {
            ClienteId = 1,
            Itens = new List<CreatePedidoItemDto> { new() { ProdutoId = 1, Quantidade = 1 } }
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _pedidoService.CreateAsync(dto));
        ex.Message.Should().Contain("cliente inativo");
    }

    [Fact]
    public async Task CreateAsync_ComEstoqueInsuficiente_DeveLancarBusinessException()
    {
        // Arrange
        var cliente = new Cliente { Id = 1, Nome = "Cliente Teste", Ativo = true };
        var produto = new Produto { Id = 10, Nome = "Monitor 4K", Preco = 2000m, Estoque = 2, Ativo = true };

        _clienteRepositoryMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(cliente);

        _produtoRepositoryMock
            .Setup(r => r.GetByIdAsync(10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(produto);

        var dto = new CreatePedidoDto
        {
            ClienteId = 1,
            Itens = new List<CreatePedidoItemDto> { new() { ProdutoId = 10, Quantidade = 5 } } // Solicitando 5, mas tem 2
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _pedidoService.CreateAsync(dto));
        ex.Message.Should().Contain("Estoque insuficiente");
    }

    [Fact]
    public async Task CreateAsync_ComDadosValidos_DeveDeduzirEstoqueECriarPedido()
    {
        // Arrange
        var cliente = new Cliente { Id = 1, Nome = "Cliente Teste", Ativo = true };
        var produto = new Produto { Id = 10, Nome = "Notebook Pro", Preco = 5000m, Estoque = 10, Ativo = true };

        _clienteRepositoryMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(cliente);

        _produtoRepositoryMock
            .Setup(r => r.GetByIdAsync(10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(produto);

        _pedidoRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Pedido>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Pedido p, CancellationToken ct) =>
            {
                p.Id = 99;
                return p;
            });

        _pedidoRepositoryMock
            .Setup(r => r.GetWithDetailsAsync(99, It.IsAny<CancellationToken>()))
            .ReturnsAsync((int id, CancellationToken ct) => new Pedido
            {
                Id = 99,
                ClienteId = 1,
                Cliente = cliente,
                Status = StatusPedido.Pendente,
                ValorTotal = 10000m,
                Itens = new List<PedidoItem>
                {
                    new() { Id = 1, ProdutoId = 10, Produto = produto, Quantidade = 2, PrecoUnitario = 5000m }
                }
            });

        var dto = new CreatePedidoDto
        {
            ClienteId = 1,
            Itens = new List<CreatePedidoItemDto> { new() { ProdutoId = 10, Quantidade = 2 } }
        };

        // Act
        var result = await _pedidoService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(99);
        result.ValorTotal.Should().Be(10000m);
        produto.Estoque.Should().Be(8); // Estoque foi deduzido de 10 para 8
        _produtoRepositoryMock.Verify(r => r.UpdateAsync(produto, It.IsAny<CancellationToken>()), Times.Once);
    }
}
