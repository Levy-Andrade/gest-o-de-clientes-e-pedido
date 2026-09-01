using GestaoClientesPedidos.Core.DTOs.Clientes;
using GestaoClientesPedidos.Core.DTOs.Common;

namespace GestaoClientesPedidos.Core.Interfaces.Services;

public interface IClienteService
{
    Task<PagedResult<ClienteDto>> GetAllPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default);
    Task<ClienteDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ClienteDto> CreateAsync(CreateClienteDto createDto, CancellationToken cancellationToken = default);
    Task<ClienteDto> UpdateAsync(int id, UpdateClienteDto updateDto, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
