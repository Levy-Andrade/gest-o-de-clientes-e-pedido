namespace GestaoClientesPedidos.Core.Entities;

public class PedidoItem : BaseEntity
{
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;

    public int ProdutoId { get; set; }
    public Produto Produto { get; set; } = null!;

    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }

    public decimal Subtotal => Quantidade * PrecoUnitario;
}
