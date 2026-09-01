using GestaoClientesPedidos.Core.DTOs.Dashboard;

namespace GestaoClientesPedidos.Core.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardMetricsDto> GetMetricsAsync(CancellationToken cancellationToken = default);
}
