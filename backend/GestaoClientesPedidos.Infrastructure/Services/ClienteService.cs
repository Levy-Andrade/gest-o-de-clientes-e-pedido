using GestaoClientesPedidos.Core.DTOs.Clientes;
using GestaoClientesPedidos.Core.DTOs.Common;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Exceptions;
using GestaoClientesPedidos.Core.Interfaces.Repositories;
using GestaoClientesPedidos.Core.Interfaces.Services;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<PagedResult<ClienteDto>> GetAllPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default)
    {
        var pagedClientes = await _clienteRepository.GetPagedAsync(paginationParams, cancellationToken);

        var dtos = pagedClientes.Items.Select(c => MapToDto(c)).ToList();

        return new PagedResult<ClienteDto>(
            dtos,
            pagedClientes.TotalCount,
            pagedClientes.PageNumber,
            pagedClientes.PageSize
        );
    }

    public async Task<ClienteDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var cliente = await _clienteRepository.GetWithPedidosAsync(id, cancellationToken);
        if (cliente == null)
        {
            throw new NotFoundException("Cliente", id);
        }

        return MapToDto(cliente);
    }

    public async Task<ClienteDto> CreateAsync(CreateClienteDto createDto, CancellationToken cancellationToken = default)
    {
        var docLimpo = LimparFormatacao(createDto.Documento);
        var emailLimpo = createDto.Email.Trim().ToLower();

        var documentoExiste = await _clienteRepository.ExistsAsync(c => c.Documento == docLimpo, cancellationToken);
        if (documentoExiste)
        {
            throw new BusinessException("Já existe um cliente cadastrado com este CPF/CNPJ.");
        }

        var cliente = new Cliente
        {
            Nome = createDto.Nome.Trim(),
            Email = emailLimpo,
            Documento = docLimpo,
            Telefone = createDto.Telefone.Trim(),
            Endereco = createDto.Endereco?.Trim() ?? string.Empty,
            Cidade = createDto.Cidade?.Trim() ?? string.Empty,
            Estado = createDto.Estado?.Trim() ?? string.Empty,
            Cep = createDto.Cep?.Trim() ?? string.Empty,
            Ativo = createDto.Ativo
        };

        var criado = await _clienteRepository.AddAsync(cliente, cancellationToken);
        return MapToDto(criado);
    }

    public async Task<ClienteDto> UpdateAsync(int id, UpdateClienteDto updateDto, CancellationToken cancellationToken = default)
    {
        var cliente = await _clienteRepository.GetByIdAsync(id, cancellationToken);
        if (cliente == null)
        {
            throw new NotFoundException("Cliente", id);
        }

        var docLimpo = LimparFormatacao(updateDto.Documento);
        var emailLimpo = updateDto.Email.Trim().ToLower();

        var documentoEmUsoPorOutro = await _clienteRepository.ExistsAsync(c => c.Documento == docLimpo && c.Id != id, cancellationToken);
        if (documentoEmUsoPorOutro)
        {
            throw new BusinessException("Já existe outro cliente cadastrado com este CPF/CNPJ.");
        }

        cliente.Nome = updateDto.Nome.Trim();
        cliente.Email = emailLimpo;
        cliente.Documento = docLimpo;
        cliente.Telefone = updateDto.Telefone.Trim();
        cliente.Endereco = updateDto.Endereco?.Trim() ?? string.Empty;
        cliente.Cidade = updateDto.Cidade?.Trim() ?? string.Empty;
        cliente.Estado = updateDto.Estado?.Trim() ?? string.Empty;
        cliente.Cep = updateDto.Cep?.Trim() ?? string.Empty;
        cliente.Ativo = updateDto.Ativo;

        await _clienteRepository.UpdateAsync(cliente, cancellationToken);
        return MapToDto(cliente);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var cliente = await _clienteRepository.GetWithPedidosAsync(id, cancellationToken);
        if (cliente == null)
        {
            throw new NotFoundException("Cliente", id);
        }

        if (cliente.Pedidos.Any())
        {
            throw new BusinessException("Não é possível excluir um cliente que possui pedidos vinculados. Considere inativá-lo.");
        }

        await _clienteRepository.DeleteAsync(cliente, cancellationToken);
    }

    private static ClienteDto MapToDto(Cliente cliente)
    {
        return new ClienteDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            Email = cliente.Email,
            Documento = FormatarDocumento(cliente.Documento),
            Telefone = cliente.Telefone,
            Endereco = cliente.Endereco,
            Cidade = cliente.Cidade,
            Estado = cliente.Estado,
            Cep = cliente.Cep,
            Ativo = cliente.Ativo,
            CriadoEm = cliente.CriadoEm,
            TotalPedidos = cliente.Pedidos?.Count ?? 0
        };
    }

    private static string LimparFormatacao(string doc)
    {
        if (string.IsNullOrWhiteSpace(doc)) return string.Empty;
        return doc.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
    }

    private static string FormatarDocumento(string doc)
    {
        var limpo = LimparFormatacao(doc);
        if (limpo.Length == 11) // CPF
        {
            return Convert.ToUInt64(limpo).ToString(@"000\.000\.000\-00");
        }
        if (limpo.Length == 14) // CNPJ
        {
            return Convert.ToUInt64(limpo).ToString(@"00\.000\.000\/0000\-00");
        }
        return doc;
    }
}
