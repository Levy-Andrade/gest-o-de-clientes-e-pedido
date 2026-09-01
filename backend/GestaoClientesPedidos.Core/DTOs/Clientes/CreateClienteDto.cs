using System.ComponentModel.DataAnnotations;

namespace GestaoClientesPedidos.Core.DTOs.Clientes;

public class CreateClienteDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "O documento (CPF/CNPJ) é obrigatório.")]
    [StringLength(20, MinimumLength = 11, ErrorMessage = "O documento deve ter entre 11 e 20 caracteres.")]
    public string Documento { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone é obrigatório.")]
    [StringLength(20, ErrorMessage = "O telefone pode ter no máximo 20 caracteres.")]
    public string Telefone { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
}
