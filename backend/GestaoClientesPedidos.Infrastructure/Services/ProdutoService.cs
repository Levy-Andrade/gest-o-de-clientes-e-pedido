using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Produtos;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _produtoRepository;

    public ProdutoService(IProdutoRepository produtoRepository)
    {
        _produtoRepository = produtoRepository;
    }

    public async Task<PagedResult<ProdutoDto>> GetAllPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default)
    {
        var pagedProdutos = await _produtoRepository.GetPagedAsync(paginationParams, cancellationToken);

        var dtos = pagedProdutos.Items.Select(MapToDto).ToList();

        return new PagedResult<ProdutoDto>(
            dtos,
            pagedProdutos.TotalCount,
            pagedProdutos.PageNumber,
            pagedProdutos.PageSize
        );
    }

    public async Task<ProdutoDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var produto = await _produtoRepository.GetByIdAsync(id, cancellationToken);
        if (produto == null)
        {
            throw new NotFoundException("Produto", id);
        }

        return MapToDto(produto);
    }

    public async Task<ProdutoDto> CreateAsync(CreateProdutoDto createDto, CancellationToken cancellationToken = default)
    {
        var skuLimpo = createDto.Sku.Trim().ToUpper();

        var skuExiste = await _produtoRepository.ExistsAsync(p => p.Sku.ToUpper() == skuLimpo, cancellationToken);
        if (skuExiste)
        {
            throw new BusinessException($"Já existe um produto cadastrado com o SKU '{skuLimpo}'.");
        }

        var produto = new Produto
        {
            Nome = createDto.Nome.Trim(),
            Descricao = createDto.Descricao?.Trim() ?? string.Empty,
            Sku = skuLimpo,
            Preco = createDto.Preco,
            Estoque = createDto.Estoque,
            Ativo = createDto.Ativo
        };

        var criado = await _produtoRepository.AddAsync(produto, cancellationToken);
        return MapToDto(criado);
    }

    public async Task<ProdutoDto> UpdateAsync(int id, UpdateProdutoDto updateDto, CancellationToken cancellationToken = default)
    {
        var produto = await _produtoRepository.GetByIdAsync(id, cancellationToken);
        if (produto == null)
        {
            throw new NotFoundException("Produto", id);
        }

        var skuLimpo = updateDto.Sku.Trim().ToUpper();

        var skuEmUso = await _produtoRepository.ExistsAsync(p => p.Sku.ToUpper() == skuLimpo && p.Id != id, cancellationToken);
        if (skuEmUso)
        {
            throw new BusinessException($"Já existe outro produto cadastrado com o SKU '{skuLimpo}'.");
        }

        produto.Nome = updateDto.Nome.Trim();
        produto.Descricao = updateDto.Descricao?.Trim() ?? string.Empty;
        produto.Sku = skuLimpo;
        produto.Preco = updateDto.Preco;
        produto.Estoque = updateDto.Estoque;
        produto.Ativo = updateDto.Ativo;

        await _produtoRepository.UpdateAsync(produto, cancellationToken);
        return MapToDto(produto);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var produto = await _produtoRepository.GetByIdAsync(id, cancellationToken);
        if (produto == null)
        {
            throw new NotFoundException("Produto", id);
        }

        await _produtoRepository.DeleteAsync(produto, cancellationToken);
    }

    public async Task<IReadOnlyList<ProdutoDto>> GetEstoqueCriticoAsync(int limite = 5, CancellationToken cancellationToken = default)
    {
        var produtos = await _produtoRepository.GetEstoqueCriticoAsync(limite, cancellationToken);
        return produtos.Select(MapToDto).ToList();
    }

    private static ProdutoDto MapToDto(Produto p) => new()
    {
        Id = p.Id,
        Nome = p.Nome,
        Descricao = p.Descricao,
        Sku = p.Sku,
        Preco = p.Preco,
        Estoque = p.Estoque,
        Ativo = p.Ativo,
        CriadoEm = p.CriadoEm
    };
}
