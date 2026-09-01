using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.Interfaces.Repositories;

public interface IPedidoRepository : IRepository<Pedido>
{
    Task<PagedResult<Pedido>> GetPagedAsync(PaginationParams paginationParams, StatusPedido? status = null, int? clienteId = null, CancellationToken cancellationToken = default);
    Task<Pedido?> GetWithDetailsAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Pedido>> GetUltimosPedidosAsync(int quantidade = 5, CancellationToken cancellationToken = default);
    Task<decimal> GetTotalFaturamentoAsync(DateTime? dataInicio = null, DateTime? dataFim = null, CancellationToken cancellationToken = default);
    Task<int> GetTotalPedidosCountAsync(DateTime? dataInicio = null, DateTime? dataFim = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Pedido>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default);
}
