using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Produtos;
using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

[Authorize]
public class ProdutosController : BaseApiController
{
    private readonly IProdutoService _produtoService;

    public ProdutosController(IProdutoService produtoService)
    {
        _produtoService = produtoService;
    }

    /// <summary>
    /// Lista produtos de forma paginada com suporte a filtros e ordenação.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        var result = await _produtoService.GetAllPagedAsync(paginationParams, cancellationToken);
        return CustomResponse(result);
    }

    /// <summary>
    /// Lista produtos com estoque crítico (< 5 unidades).
    /// </summary>
    [HttpGet("estoque-critico")]
    public async Task<IActionResult> GetEstoqueCritico([FromQuery] int limite = 5, CancellationToken cancellationToken = default)
    {
        var produtos = await _produtoService.GetEstoqueCriticoAsync(limite, cancellationToken);
        return CustomResponse(produtos);
    }

    /// <summary>
    /// Obtém detalhes de um produto específico por ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var produto = await _produtoService.GetByIdAsync(id, cancellationToken);
        return CustomResponse(produto);
    }

    /// <summary>
    /// Cadastra um novo produto.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProdutoDto createDto, CancellationToken cancellationToken)
    {
        var produto = await _produtoService.CreateAsync(createDto, cancellationToken);
        return CustomCreatedResponse(nameof(GetById), new { id = produto.Id }, produto, "Produto cadastrado com sucesso!");
    }

    /// <summary>
    /// Atualiza os dados de um produto existente.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProdutoDto updateDto, CancellationToken cancellationToken)
    {
        var produto = await _produtoService.UpdateAsync(id, updateDto, cancellationToken);
        return CustomResponse(produto, "Produto atualizado com sucesso!");
    }

    /// <summary>
    /// Remove um produto do catálogo.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _produtoService.DeleteAsync(id, cancellationToken);
        return CustomNoContent("Produto excluído com sucesso!");
    }
}
