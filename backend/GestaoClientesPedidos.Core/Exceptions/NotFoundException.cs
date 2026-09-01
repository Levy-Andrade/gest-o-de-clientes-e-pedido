namespace GestaoClientesPedidos.Core.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
    public NotFoundException(string entityName, object key) : base($"A entidade '{entityName}' com o identificador '{key}' não foi encontrada.") { }
}
