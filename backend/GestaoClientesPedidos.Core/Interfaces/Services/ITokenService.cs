using GestaoClientesPedidos.Core.Entities;

namespace GestaoClientesPedidos.Core.Interfaces.Services;

public interface ITokenService
{
    string GenerateToken(Usuario usuario);
    DateTime GetExpirationDate();
}
