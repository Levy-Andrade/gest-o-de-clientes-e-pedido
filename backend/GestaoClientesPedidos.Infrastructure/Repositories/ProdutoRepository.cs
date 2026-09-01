using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestaoClientesPedidos.Infrastructure.Repositories;

public class ProdutoRepository : GenericRepository<Produto>, IProdutoRepository
{
    public ProdutoRepository(AppDbContext context) : base(context) { }

    public async Task<PagedResult<Produto>> GetPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(paginationParams.Search))
        {
            var search = paginationParams.Search.Trim().ToLower();
            query = query.Where(p => p.Nome.ToLower().Contains(search) ||
                                     p.Sku.ToLower().Contains(search) ||
                                     p.Descricao.ToLower().Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        query = paginationParams.SortBy?.ToLower() switch
        {
            "nome" => paginationParams.IsAscending ? query.OrderBy(p => p.Nome) : query.OrderByDescending(p => p.Nome),
            "preco" => paginationParams.IsAscending ? query.OrderBy(p => p.Preco) : query.OrderByDescending(p => p.Preco),
            "estoque" => paginationParams.IsAscending ? query.OrderBy(p => p.Estoque) : query.OrderByDescending(p => p.Estoque),
            "sku" => paginationParams.IsAscending ? query.OrderBy(p => p.Sku) : query.OrderByDescending(p => p.Sku),
            _ => paginationParams.IsAscending ? query.OrderByDescending(p => p.CriadoEm) : query.OrderBy(p => p.CriadoEm)
        };

        var items = await query
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Produto>(items, totalCount, paginationParams.PageNumber, paginationParams.PageSize);
    }

    public async Task<IReadOnlyList<Produto>> GetEstoqueCriticoAsync(int limite = 5, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking()
            .Where(p => p.Ativo && p.Estoque < limite)
            .OrderBy(p => p.Estoque)
            .ToListAsync(cancellationToken);
    }
}
