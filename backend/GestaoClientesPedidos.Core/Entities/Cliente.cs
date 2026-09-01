namespace GestaoClientesPedidos.Core.Entities;

public class Cliente : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty; // CPF ou CNPJ
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;

    // Navigation property
    public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
