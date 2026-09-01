using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;

namespace GestaoClientesPedidos.Core.Interfaces.Repositories;

public interface IClienteRepository : IRepository<Cliente>
{
    Task<PagedResult<Cliente>> GetPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default);
    Task<Cliente?> GetWithPedidosAsync(int id, CancellationToken cancellationToken = default);
}
