using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.DTOs.Pedidos;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class PedidoService : IPedidoService
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IClienteRepository _clienteRepository;
    private readonly IProdutoRepository _produtoRepository;

    public PedidoService(
        IPedidoRepository pedidoRepository,
        IClienteRepository clienteRepository,
        IProdutoRepository produtoRepository)
    {
        _pedidoRepository = pedidoRepository;
        _clienteRepository = clienteRepository;
        _produtoRepository = produtoRepository;
    }

    public async Task<PagedResult<PedidoDto>> GetAllPagedAsync(
        PaginationParams paginationParams,
        StatusPedido? status = null,
        int? clienteId = null,
        CancellationToken cancellationToken = default)
    {
        var pagedPedidos = await _pedidoRepository.GetPagedAsync(paginationParams, status, clienteId, cancellationToken);

        var dtos = pagedPedidos.Items.Select(MapToDto).ToList();

        return new PagedResult<PedidoDto>(
            dtos,
            pagedPedidos.TotalCount,
            pagedPedidos.PageNumber,
            pagedPedidos.PageSize
        );
    }

    public async Task<PedidoDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var pedido = await _pedidoRepository.GetWithDetailsAsync(id, cancellationToken);
        if (pedido == null)
        {
            throw new NotFoundException("Pedido", id);
        }

        return MapToDto(pedido);
    }

    public async Task<PedidoDto> CreateAsync(CreatePedidoDto createDto, CancellationToken cancellationToken = default)
    {
        if (createDto.Itens == null || !createDto.Itens.Any())
        {
            throw new BusinessException("O pedido deve conter pelo menos um item.");
        }

        var cliente = await _clienteRepository.GetByIdAsync(createDto.ClienteId, cancellationToken);
        if (cliente == null)
        {
            throw new NotFoundException("Cliente", createDto.ClienteId);
        }

        if (!cliente.Ativo)
        {
            throw new BusinessException("Não é possível criar pedidos para um cliente inativo.");
        }

        var pedido = new Pedido
        {
            ClienteId = createDto.ClienteId,
            DataPedido = DateTime.UtcNow,
            Status = StatusPedido.Pendente,
            Desconto = createDto.Desconto,
            Observacoes = createDto.Observacoes?.Trim(),
            CriadoEm = DateTime.UtcNow
        };

        foreach (var itemDto in createDto.Itens)
        {
            var produto = await _produtoRepository.GetByIdAsync(itemDto.ProdutoId, cancellationToken);
            if (produto == null)
            {
                throw new NotFoundException("Produto", itemDto.ProdutoId);
            }

            if (!produto.Ativo)
            {
                throw new BusinessException($"O produto '{produto.Nome}' está inativo e não pode ser incluído no pedido.");
            }

            if (produto.Estoque < itemDto.Quantidade)
            {
                throw new BusinessException($"Estoque insuficiente para o produto '{produto.Nome}'. Disponível: {produto.Estoque}, Solicitado: {itemDto.Quantidade}.");
            }

            // Deduz o estoque
            produto.Estoque -= itemDto.Quantidade;
            await _produtoRepository.UpdateAsync(produto, cancellationToken);

            pedido.Itens.Add(new PedidoItem
            {
                ProdutoId = produto.Id,
                Quantidade = itemDto.Quantidade,
                PrecoUnitario = produto.Preco,
                CriadoEm = DateTime.UtcNow
            });
        }

        pedido.CalcularTotal();

        var pedidoCriado = await _pedidoRepository.AddAsync(pedido, cancellationToken);
        var pedidoCompleto = await _pedidoRepository.GetWithDetailsAsync(pedidoCriado.Id, cancellationToken);

        return MapToDto(pedidoCompleto!);
    }

    public async Task<PedidoDto> UpdateStatusAsync(int id, UpdatePedidoStatusDto updateDto, CancellationToken cancellationToken = default)
    {
        var pedido = await _pedidoRepository.GetWithDetailsAsync(id, cancellationToken);
        if (pedido == null)
        {
            throw new NotFoundException("Pedido", id);
        }

        var statusAnterior = pedido.Status;
        var novoStatus = updateDto.Status;

        if (statusAnterior == StatusPedido.Cancelado)
        {
            throw new BusinessException("Não é possível alterar o status de um pedido já cancelado.");
        }

        if (statusAnterior == StatusPedido.Concluido && novoStatus == StatusPedido.Pendente)
        {
            throw new BusinessException("Não é possível reabrir como pendente um pedido já concluído.");
        }

        // Se estiver cancelando agora, estorna o estoque dos itens
        if (novoStatus == StatusPedido.Cancelado && statusAnterior != StatusPedido.Cancelado)
        {
            foreach (var item in pedido.Itens)
            {
                var produto = await _produtoRepository.GetByIdAsync(item.ProdutoId, cancellationToken);
                if (produto != null)
                {
                    produto.Estoque += item.Quantidade;
                    await _produtoRepository.UpdateAsync(produto, cancellationToken);
                }
            }
        }

        pedido.Status = novoStatus;
        pedido.AtualizadoEm = DateTime.UtcNow;

        await _pedidoRepository.UpdateAsync(pedido, cancellationToken);
        return MapToDto(pedido);
    }

    public async Task CancelarAsync(int id, CancellationToken cancellationToken = default)
    {
        await UpdateStatusAsync(id, new UpdatePedidoStatusDto { Status = StatusPedido.Cancelado }, cancellationToken);
    }

    private static PedidoDto MapToDto(Pedido pedido) => new()
    {
        Id = pedido.Id,
        ClienteId = pedido.ClienteId,
        ClienteNome = pedido.Cliente?.Nome ?? string.Empty,
        ClienteEmail = pedido.Cliente?.Email ?? string.Empty,
        ClienteDocumento = pedido.Cliente?.Documento ?? string.Empty,
        DataPedido = pedido.DataPedido,
        Status = pedido.Status,
        ValorTotal = pedido.ValorTotal,
        Desconto = pedido.Desconto,
        Observacoes = pedido.Observacoes,
        Itens = pedido.Itens.Select(i => new PedidoItemDto
        {
            Id = i.Id,
            ProdutoId = i.ProdutoId,
            ProdutoNome = i.Produto?.Nome ?? string.Empty,
            ProdutoSku = i.Produto?.Sku ?? string.Empty,
            Quantidade = i.Quantidade,
            PrecoUnitario = i.PrecoUnitario
        }).ToList()
    };
}
