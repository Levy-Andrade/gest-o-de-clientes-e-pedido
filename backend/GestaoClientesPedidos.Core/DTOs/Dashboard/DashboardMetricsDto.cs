using GestaoClientesPedidos.Core.DTOs.Pedidos;

namespace GestaoClientesPedidos.Core.DTOs.Dashboard;

public class DashboardMetricsDto
{
    public decimal TotalFaturamento { get; set; }
    public decimal FaturamentoMesAtual { get; set; }
    public int TotalPedidos { get; set; }
    public int PedidosMesAtual { get; set; }
    public int TotalClientes { get; set; }
    public int ClientesAtivos { get; set; }
    public int ProdutosCadastrados { get; set; }
    public int ProdutosEstoqueCritico { get; set; } // Estoque < 5

    public List<VendasPorMesDto> HistoricoVendas { get; set; } = new();
    public List<StatusContagemDto> PedidosPorStatus { get; set; } = new();
    public List<TopClienteDto> TopClientes { get; set; } = new();
    public List<PedidoDto> UltimosPedidos { get; set; } = new();
}

public class VendasPorMesDto
{
    public string Mes { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int QuantidadePedidos { get; set; }
}

public class StatusContagemDto
{
    public string Status { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal ValorTotal { get; set; }
}

public class TopClienteDto
{
    public int ClienteId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int QuantidadePedidos { get; set; }
    public decimal TotalGasto { get; set; }
}
