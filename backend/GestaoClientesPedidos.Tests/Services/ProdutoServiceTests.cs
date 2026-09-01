using System.Linq.Expressions;
using FluentAssertions;
using GestaoClientesPedidos.Core.DTOs.Produtos;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Services;
using Moq;
using Xunit;

namespace GestaoClientesPedidos.Tests.Services;

public class ProdutoServiceTests
{
    private readonly Mock<IProdutoRepository> _produtoRepositoryMock;
    private readonly ProdutoService _produtoService;

    public ProdutoServiceTests()
    {
        _produtoRepositoryMock = new Mock<IProdutoRepository>();
        _produtoService = new ProdutoService(_produtoRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ComSkuExistente_DeveLancarBusinessException()
    {
        // Arrange
        _produtoRepositoryMock
            .Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<Produto, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var dto = new CreateProdutoDto
        {
            Nome = "Mouse Gamer",
            Sku = "MOU-GAM-01",
            Preco = 150m,
            Estoque = 10
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<BusinessException>(() => _produtoService.CreateAsync(dto));
        ex.Message.Should().Contain("Já existe um produto cadastrado com o SKU");
    }

    [Fact]
    public async Task CreateAsync_ComDadosValidos_DeveCriarProdutoComSucesso()
    {
        // Arrange
        _produtoRepositoryMock
            .Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<Produto, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _produtoRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Produto>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Produto p, CancellationToken ct) =>
            {
                p.Id = 5;
                p.CriadoEm = DateTime.UtcNow;
                return p;
            });

        var dto = new CreateProdutoDto
        {
            Nome = "Mouse Gamer Pro",
            Sku = "MOU-PRO-01",
            Preco = 299.90m,
            Estoque = 20
        };

        // Act
        var result = await _produtoService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(5);
        result.Sku.Should().Be("MOU-PRO-01");
        result.Preco.Should().Be(299.90m);
    }
}
