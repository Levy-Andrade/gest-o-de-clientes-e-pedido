using System.ComponentModel.DataAnnotations;

namespace GestaoClientesPedidos.Core.DTOs.Pedidos;

public class CreatePedidoDto
{
    [Required(ErrorMessage = "O identificador do cliente é obrigatório.")]
    [Range(1, int.MaxValue, ErrorMessage = "ID do cliente inválido.")]
    public int ClienteId { get; set; }

    [Range(0, 100000.00, ErrorMessage = "O desconto não pode ser negativo.")]
    public decimal Desconto { get; set; } = 0;

    public string? Observacoes { get; set; }

    [Required(ErrorMessage = "O pedido deve conter pelo menos um item.")]
    [MinLength(1, ErrorMessage = "Adicione ao menos um produto ao pedido.")]
    public List<CreatePedidoItemDto> Itens { get; set; } = new();
}
