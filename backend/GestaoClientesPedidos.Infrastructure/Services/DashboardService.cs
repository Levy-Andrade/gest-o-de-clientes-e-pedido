using System.Globalization;
using GestaoClientesPedidos.Core.DTOs.Dashboard;
using GestaoClientesPedidos.Core.DTOs.Pedidos;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IProdutoRepository _produtoRepository;

    public DashboardService(
        IPedidoRepository pedidoRepository,
        IClienteRepository clienteRepository,
        IProdutoRepository produtoRepository)
    {
        _pedidoRepository = pedidoRepository;
        _clienteRepository = clienteRepository;
        _produtoRepository = produtoRepository;
    }

    public async Task<DashboardMetricsDto> GetMetricsAsync(CancellationToken cancellationToken = default)
    {
        var agora = DateTime.UtcNow;
        var inicioMesAtual = new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        // Faturamento
        var totalFaturamento = await _pedidoRepository.GetTotalFaturamentoAsync(null, null, cancellationToken);
        var faturamentoMes = await _pedidoRepository.GetTotalFaturamentoAsync(inicioMesAtual, null, cancellationToken);

        // Pedidos
        var totalPedidos = await _pedidoRepository.GetTotalPedidosCountAsync(null, null, cancellationToken);
        var pedidosMes = await _pedidoRepository.GetTotalPedidosCountAsync(inicioMesAtual, null, cancellationToken);

        // Clientes
        var totalClientes = await _clienteRepository.CountAsync(null, cancellationToken);
        var clientesAtivos = await _clienteRepository.CountAsync(c => c.Ativo, cancellationToken);

        // Produtos
        var totalProdutos = await _produtoRepository.CountAsync(null, cancellationToken);
        var produtosEstoqueCritico = await _produtoRepository.CountAsync(p => p.Ativo && p.Estoque < 5, cancellationToken);

        // Todos os pedidos com detalhes para agregações
        var todosPedidos = await _pedidoRepository.GetAllWithDetailsAsync(cancellationToken);

        // Histórico dos últimos 6 meses
        var culturaPtBr = new CultureInfo("pt-BR");
        var historicoVendas = new List<VendasPorMesDto>();

        for (int i = 5; i >= 0; i--)
        {
            var dataRef = agora.AddMonths(-i);
            var ano = dataRef.Year;
            var mes = dataRef.Month;
            var nomeMes = dataRef.ToString("MMM/yy", culturaPtBr);

            var pedidosDoMes = todosPedidos
                .Where(p => p.DataPedido.Year == ano && p.DataPedido.Month == mes && p.Status != StatusPedido.Cancelado)
                .ToList();

            historicoVendas.Add(new VendasPorMesDto
            {
                Mes = nomeMes,
                Total = pedidosDoMes.Sum(p => p.ValorTotal),
                QuantidadePedidos = pedidosDoMes.Count
            });
        }

        // Distribuição por Status
        var statusValues = Enum.GetValues<StatusPedido>();
        var pedidosPorStatus = statusValues.Select(status =>
        {
            var doStatus = todosPedidos.Where(p => p.Status == status).ToList();
            return new StatusContagemDto
            {
                Status = status.ToString(),
                Quantidade = doStatus.Count,
                ValorTotal = doStatus.Sum(p => p.ValorTotal)
            };
        }).ToList();

        // Top Clientes
        var topClientes = todosPedidos
            .Where(p => p.Status != StatusPedido.Cancelado && p.Cliente != null)
            .GroupBy(p => new { p.ClienteId, p.Cliente.Nome, p.Cliente.Email })
            .Select(g => new TopClienteDto
            {
                ClienteId = g.Key.ClienteId,
                Nome = g.Key.Nome,
                Email = g.Key.Email,
                QuantidadePedidos = g.Count(),
                TotalGasto = g.Sum(p => p.ValorTotal)
            })
            .OrderByDescending(c => c.TotalGasto)
            .Take(5)
            .ToList();

        // Últimos Pedidos
        var ultimosPedidosEntidades = await _pedidoRepository.GetUltimosPedidosAsync(5, cancellationToken);
        var ultimosPedidosDtos = ultimosPedidosEntidades.Select(p => new PedidoDto
        {
            Id = p.Id,
            ClienteId = p.ClienteId,
            ClienteNome = p.Cliente?.Nome ?? string.Empty,
            ClienteEmail = p.Cliente?.Email ?? string.Empty,
            ClienteDocumento = p.Cliente?.Documento ?? string.Empty,
            DataPedido = p.DataPedido,
            Status = p.Status,
            ValorTotal = p.ValorTotal,
            Desconto = p.Desconto,
            Observacoes = p.Observacoes,
            Itens = p.Itens.Select(i => new PedidoItemDto
            {
                Id = i.Id,
                ProdutoId = i.ProdutoId,
                ProdutoNome = i.Produto?.Nome ?? string.Empty,
                ProdutoSku = i.Produto?.Sku ?? string.Empty,
                Quantidade = i.Quantidade,
                PrecoUnitario = i.PrecoUnitario
            }).ToList()
        }).ToList();

        return new DashboardMetricsDto
        {
            TotalFaturamento = totalFaturamento,
            FaturamentoMesAtual = faturamentoMes,
            TotalPedidos = totalPedidos,
            PedidosMesAtual = pedidosMes,
            TotalClientes = totalClientes,
            ClientesAtivos = clientesAtivos,
            ProdutosCadastrados = totalProdutos,
            ProdutosEstoqueCritico = produtosEstoqueCritico,
            HistoricoVendas = historicoVendas,
            PedidosPorStatus = pedidosPorStatus,
            TopClientes = topClientes,
            UltimosPedidos = ultimosPedidosDtos
        };
    }
}
