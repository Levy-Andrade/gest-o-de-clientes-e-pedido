using System.ComponentModel.DataAnnotations;

namespace GestaoClientesPedidos.Core.DTOs.Pedidos;

public class CreatePedidoItemDto
{
    [Required(ErrorMessage = "O identificador do produto é obrigatório.")]
    [Range(1, int.MaxValue, ErrorMessage = "ID do produto inválido.")]
    public int ProdutoId { get; set; }

    [Required(ErrorMessage = "A quantidade é obrigatória.")]
    [Range(1, 10000, ErrorMessage = "A quantidade deve ser de no mínimo 1 unidade.")]
    public int Quantidade { get; set; }
}
