using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.DTOs.Pedidos;

public class PedidoDto
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public string ClienteEmail { get; set; } = string.Empty;
    public string ClienteDocumento { get; set; } = string.Empty;
    public DateTime DataPedido { get; set; }
    public StatusPedido Status { get; set; }
    public string StatusDescricao => Status.ToString();
    public decimal ValorTotal { get; set; }
    public decimal Desconto { get; set; }
    public string? Observacoes { get; set; }
    public List<PedidoItemDto> Itens { get; set; } = new();
}
