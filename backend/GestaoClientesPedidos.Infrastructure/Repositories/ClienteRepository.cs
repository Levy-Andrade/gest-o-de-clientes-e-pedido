using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestaoClientesPedidos.Infrastructure.Repositories;

public class ClienteRepository : GenericRepository<Cliente>, IClienteRepository
{
    public ClienteRepository(AppDbContext context) : base(context) { }

    public async Task<PagedResult<Cliente>> GetPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Include(c => c.Pedidos).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(paginationParams.Search))
        {
            var search = paginationParams.Search.Trim().ToLower();
            query = query.Where(c => c.Nome.ToLower().Contains(search) ||
                                     c.Email.ToLower().Contains(search) ||
                                     c.Documento.Contains(search) ||
                                     c.Telefone.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        query = paginationParams.SortBy?.ToLower() switch
        {
            "nome" => paginationParams.IsAscending ? query.OrderBy(c => c.Nome) : query.OrderByDescending(c => c.Nome),
            "email" => paginationParams.IsAscending ? query.OrderBy(c => c.Email) : query.OrderByDescending(c => c.Email),
            "documento" => paginationParams.IsAscending ? query.OrderBy(c => c.Documento) : query.OrderByDescending(c => c.Documento),
            "ativo" => paginationParams.IsAscending ? query.OrderBy(c => c.Ativo) : query.OrderByDescending(c => c.Ativo),
            _ => paginationParams.IsAscending ? query.OrderByDescending(c => c.CriadoEm) : query.OrderBy(c => c.CriadoEm)
        };

        var items = await query
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Cliente>(items, totalCount, paginationParams.PageNumber, paginationParams.PageSize);
    }

    public async Task<Cliente?> GetWithPedidosAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Pedidos)
                .ThenInclude(p => p.Itens)
                    .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }
}
