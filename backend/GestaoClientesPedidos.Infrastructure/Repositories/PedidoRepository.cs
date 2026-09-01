using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestaoClientesPedidos.Infrastructure.Repositories;

public class PedidoRepository : GenericRepository<Pedido>, IPedidoRepository
{
    public PedidoRepository(AppDbContext context) : base(context) { }

    public async Task<PagedResult<Pedido>> GetPagedAsync(
        PaginationParams paginationParams,
        StatusPedido? status = null,
        int? clienteId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
            .AsNoTracking()
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        if (clienteId.HasValue)
        {
            query = query.Where(p => p.ClienteId == clienteId.Value);
        }

        if (!string.IsNullOrWhiteSpace(paginationParams.Search))
        {
            var search = paginationParams.Search.Trim().ToLower();
            query = query.Where(p => p.Cliente.Nome.ToLower().Contains(search) ||
                                     p.Cliente.Email.ToLower().Contains(search) ||
                                     p.Cliente.Documento.Contains(search) ||
                                     (p.Observacoes != null && p.Observacoes.ToLower().Contains(search)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        query = paginationParams.SortBy?.ToLower() switch
        {
            "cliente" => paginationParams.IsAscending ? query.OrderBy(p => p.Cliente.Nome) : query.OrderByDescending(p => p.Cliente.Nome),
            "valortotal" => paginationParams.IsAscending ? query.OrderBy(p => p.ValorTotal) : query.OrderByDescending(p => p.ValorTotal),
            "status" => paginationParams.IsAscending ? query.OrderBy(p => p.Status) : query.OrderByDescending(p => p.Status),
            "datapedido" => paginationParams.IsAscending ? query.OrderBy(p => p.DataPedido) : query.OrderByDescending(p => p.DataPedido),
            _ => paginationParams.IsAscending ? query.OrderByDescending(p => p.DataPedido) : query.OrderBy(p => p.DataPedido)
        };

        var items = await query
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Pedido>(items, totalCount, paginationParams.PageNumber, paginationParams.PageSize);
    }

    public async Task<Pedido?> GetWithDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Pedido>> GetUltimosPedidosAsync(int quantidade = 5, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
            .AsNoTracking()
            .OrderByDescending(p => p.DataPedido)
            .Take(quantidade)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetTotalFaturamentoAsync(DateTime? dataInicio = null, DateTime? dataFim = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().Where(p => p.Status != StatusPedido.Cancelado);

        if (dataInicio.HasValue)
            query = query.Where(p => p.DataPedido >= dataInicio.Value);

        if (dataFim.HasValue)
            query = query.Where(p => p.DataPedido <= dataFim.Value);

        return await query.SumAsync(p => p.ValorTotal, cancellationToken);
    }

    public async Task<int> GetTotalPedidosCountAsync(DateTime? dataInicio = null, DateTime? dataFim = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().AsQueryable();

        if (dataInicio.HasValue)
            query = query.Where(p => p.DataPedido >= dataInicio.Value);

        if (dataFim.HasValue)
            query = query.Where(p => p.DataPedido <= dataFim.Value);

        return await query.CountAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Pedido>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Cliente)
            .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
