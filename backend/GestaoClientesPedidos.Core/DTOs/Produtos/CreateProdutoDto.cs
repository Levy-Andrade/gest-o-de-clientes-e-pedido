using System.ComponentModel.DataAnnotations;

namespace GestaoClientesPedidos.Core.DTOs.Produtos;

public class CreateProdutoDto
{
    [Required(ErrorMessage = "O nome do produto é obrigatório.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 150 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "O código/SKU é obrigatório.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "O SKU deve ter entre 3 e 50 caracteres.")]
    public string Sku { get; set; } = string.Empty;

    [Required(ErrorMessage = "O preço é obrigatório.")]
    [Range(0.01, 1000000.00, ErrorMessage = "O preço deve ser maior que zero.")]
    public decimal Preco { get; set; }

    [Required(ErrorMessage = "A quantidade em estoque é obrigatória.")]
    [Range(0, 100000, ErrorMessage = "A quantidade em estoque não pode ser negativa.")]
    public int Estoque { get; set; }

    public bool Ativo { get; set; } = true;
}
