using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.Entities;

public class Pedido : BaseEntity
{
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public DateTime DataPedido { get; set; } = DateTime.UtcNow;
    public StatusPedido Status { get; set; } = StatusPedido.Pendente;
    public decimal ValorTotal { get; set; }
    public decimal Desconto { get; set; }
    public string? Observacoes { get; set; }

    // Navigation property
    public ICollection<PedidoItem> Itens { get; set; } = new List<PedidoItem>();

    public void CalcularTotal()
    {
        ValorTotal = Itens.Sum(i => i.Subtotal) - Desconto;
        if (ValorTotal < 0) ValorTotal = 0;
    }
}
