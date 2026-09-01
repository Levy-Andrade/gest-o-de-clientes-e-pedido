using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Pedidos;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

[Authorize]
public class PedidosController : BaseApiController
{
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    /// <summary>
    /// Lista pedidos de forma paginada com suporte a filtros por status e cliente.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PaginationParams paginationParams,
        [FromQuery] StatusPedido? status,
        [FromQuery] int? clienteId,
        CancellationToken cancellationToken)
    {
        var result = await _pedidoService.GetAllPagedAsync(paginationParams, status, clienteId, cancellationToken);
        return CustomResponse(result);
    }

    /// <summary>
    /// Obtém os detalhes completos de um pedido pelo ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var pedido = await _pedidoService.GetByIdAsync(id, cancellationToken);
        return CustomResponse(pedido);
    }

    /// <summary>
    /// Cria um novo pedido com verificação e dedução de estoque.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePedidoDto createDto, CancellationToken cancellationToken)
    {
        var pedido = await _pedidoService.CreateAsync(createDto, cancellationToken);
        return CustomCreatedResponse(nameof(GetById), new { id = pedido.Id }, pedido, "Pedido realizado com sucesso!");
    }

    /// <summary>
    /// Atualiza o status de um pedido (ex: Pendente -> Processando -> Enviado -> Concluído ou Cancelado).
    /// </summary>
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdatePedidoStatusDto updateDto, CancellationToken cancellationToken)
    {
        var pedido = await _pedidoService.UpdateStatusAsync(id, updateDto, cancellationToken);
        return CustomResponse(pedido, $"Status do pedido alterado para '{pedido.StatusDescricao}'!");
    }

    /// <summary>
    /// Cancela um pedido e estorna os itens para o estoque.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Cancelar(int id, CancellationToken cancellationToken)
    {
        await _pedidoService.CancelarAsync(id, cancellationToken);
        return CustomNoContent("Pedido cancelado com sucesso e itens devolvidos ao estoque!");
    }
}
