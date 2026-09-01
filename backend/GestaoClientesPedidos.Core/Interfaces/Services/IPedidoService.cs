using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Pedidos;
using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.Interfaces.Services;

public interface IPedidoService
{
    Task<PagedResult<PedidoDto>> GetAllPagedAsync(PaginationParams paginationParams, StatusPedido? status = null, int? clienteId = null, CancellationToken cancellationToken = default);
    Task<PedidoDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<PedidoDto> CreateAsync(CreatePedidoDto createDto, CancellationToken cancellationToken = default);
    Task<PedidoDto> UpdateStatusAsync(int id, UpdatePedidoStatusDto updateDto, CancellationToken cancellationToken = default);
    Task CancelarAsync(int id, CancellationToken cancellationToken = default);
}
