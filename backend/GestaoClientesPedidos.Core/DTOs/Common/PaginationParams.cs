namespace GestaoClientesPedidos.Core.DTOs.Common;

public class PaginationParams
{
    private const int MaxPageSize = 50;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : (value <= 0 ? 10 : value);
    }

    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public bool IsAscending { get; set; } = true;
}
