using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;

namespace GestaoClientesPedidos.Core.Interfaces.Repositories;

public interface IProdutoRepository : IRepository<Produto>
{
    Task<PagedResult<Produto>> GetPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Produto>> GetEstoqueCriticoAsync(int limite = 5, CancellationToken cancellationToken = default);
}
