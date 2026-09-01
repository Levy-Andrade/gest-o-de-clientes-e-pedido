namespace GestaoClientesPedidos.Core.Entities;

public class Produto : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int Estoque { get; set; }
    public bool Ativo { get; set; } = true;

    // Navigation property
    public ICollection<PedidoItem> Itens { get; set; } = new List<PedidoItem>();
}
