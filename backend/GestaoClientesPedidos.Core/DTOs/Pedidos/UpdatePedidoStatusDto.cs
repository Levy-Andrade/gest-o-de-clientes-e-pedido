using System.ComponentModel.DataAnnotations;
using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.DTOs.Pedidos;

public class UpdatePedidoStatusDto
{
    [Required(ErrorMessage = "O novo status é obrigatório.")]
    [EnumDataType(typeof(StatusPedido), ErrorMessage = "Status do pedido inválido.")]
    public StatusPedido Status { get; set; }
}
