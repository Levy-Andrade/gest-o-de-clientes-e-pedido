using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Produtos;

namespace GestaoClientesPedidos.Core.Interfaces.Services;

public interface IProdutoService
{
    Task<PagedResult<ProdutoDto>> GetAllPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default);
    Task<ProdutoDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProdutoDto> CreateAsync(CreateProdutoDto createDto, CancellationToken cancellationToken = default);
    Task<ProdutoDto> UpdateAsync(int id, UpdateProdutoDto updateDto, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ProdutoDto>> GetEstoqueCriticoAsync(int limite = 5, CancellationToken cancellationToken = default);
}
