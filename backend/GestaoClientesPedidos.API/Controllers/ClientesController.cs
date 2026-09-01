using GestaoClientesPedidos.Core.DTOs.Clientes;
using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

[Authorize]
public class ClientesController : BaseApiController
{
    private readonly IClienteService _clienteService;

    public ClientesController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    /// <summary>
    /// Lista clientes de forma paginada com suporte a filtros e ordenação.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        var result = await _clienteService.GetAllPagedAsync(paginationParams, cancellationToken);
        return CustomResponse(result);
    }

    /// <summary>
    /// Obtém detalhes de um cliente específico por ID.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var cliente = await _clienteService.GetByIdAsync(id, cancellationToken);
        return CustomResponse(cliente);
    }

    /// <summary>
    /// Cadastra um novo cliente.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClienteDto createDto, CancellationToken cancellationToken)
    {
        var cliente = await _clienteService.CreateAsync(createDto, cancellationToken);
        return CustomCreatedResponse(nameof(GetById), new { id = cliente.Id }, cliente, "Cliente cadastrado com sucesso!");
    }

    /// <summary>
    /// Atualiza os dados de um cliente existente.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateClienteDto updateDto, CancellationToken cancellationToken)
    {
        var cliente = await _clienteService.UpdateAsync(id, updateDto, cancellationToken);
        return CustomResponse(cliente, "Cliente atualizado com sucesso!");
    }

    /// <summary>
    /// Remove um cliente (caso não possua pedidos vinculados).
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _clienteService.DeleteAsync(id, cancellationToken);
        return CustomNoContent("Cliente excluído com sucesso!");
    }
}
