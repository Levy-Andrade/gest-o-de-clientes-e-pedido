namespace GestaoClientesPedidos.Core.DTOs.Common;

public class ApiResponse<T>
{
    public bool Sucesso { get; set; }
    public string? Mensagem { get; set; }
    public T? Dados { get; set; }
    public List<string>? Erros { get; set; }

    public static ApiResponse<T> Ok(T dados, string? mensagem = null) => new()
    {
        Sucesso = true,
        Dados = dados,
        Mensagem = mensagem
    };

    public static ApiResponse<T> Fail(string mensagem, List<string>? erros = null) => new()
    {
        Sucesso = false,
        Mensagem = mensagem,
        Erros = erros
    };
}
