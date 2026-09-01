namespace GestaoClientesPedidos.Core.Entities;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; set; }
}
