using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestaoClientesPedidos.API.Controllers;

[Authorize]
public class DashboardController : BaseApiController
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Retorna as métricas consolidadas, histórico de vendas e indicadores do sistema.
    /// </summary>
    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics(CancellationToken cancellationToken)
    {
        var metrics = await _dashboardService.GetMetricsAsync(cancellationToken);
        return CustomResponse(metrics);
    }
}
