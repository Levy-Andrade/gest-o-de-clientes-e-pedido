using GestaoClientesPedidos.Core.Entities;

namespace GestaoClientesPedidos.Core.Interfaces.Repositories;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
}
