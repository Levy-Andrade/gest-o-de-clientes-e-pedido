using GestaoClientesPedidos.Core.Enums;

namespace GestaoClientesPedidos.Core.Entities;

public class Usuario : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public PerfilUsuario Perfil { get; set; } = PerfilUsuario.Operador;
    public bool Ativo { get; set; } = true;
}
