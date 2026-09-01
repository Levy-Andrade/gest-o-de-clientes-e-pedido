namespace GestaoClientesPedidos.Core.Exceptions;

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Usuário não autorizado ou credenciais inválidas.") : base(message) { }
}
