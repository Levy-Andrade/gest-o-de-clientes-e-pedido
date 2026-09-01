using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace GestaoClientesPedidos.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        // Garante criação do banco de dados quando executado
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Usuários
        if (!await context.Usuarios.AnyAsync())
        {
            var admin = new Usuario
            {
                Nome = "Administrador do Sistema",
                Email = "admin@gestao.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                Perfil = PerfilUsuario.Administrador,
                Ativo = true,
                CriadoEm = DateTime.UtcNow
            };

            var operador = new Usuario
            {
                Nome = "Operador Padrão",
                Email = "operador@gestao.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("Operador@123456"),
                Perfil = PerfilUsuario.Operador,
                Ativo = true,
                CriadoEm = DateTime.UtcNow
            };

            await context.Usuarios.AddRangeAsync(admin, operador);
            await context.SaveChangesAsync();
        }

        // 2. Seed Clientes
        if (!await context.Clientes.AnyAsync())
        {
            var clientes = new List<Cliente>
            {
                new()
                {
                    Nome = "TechCorp Soluções Tecnológicas",
                    Email = "contato@techcorp.com.br",
                    Documento = "12.345.678/0001-90",
                    Telefone = "(11) 98765-4321",
                    Endereco = "Av. Paulista, 1000 - Bela Vista",
                    Cidade = "São Paulo",
                    Estado = "SP",
                    Cep = "01310-100",
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-5)
                },
                new()
                {
                    Nome = "Alpha Distribuidora Ltda",
                    Email = "compras@alphadistribuidora.com.br",
                    Documento = "98.765.432/0001-10",
                    Telefone = "(21) 97654-3210",
                    Endereco = "Rua do Ouvidor, 50 - Centro",
                    Cidade = "Rio de Janeiro",
                    Estado = "RJ",
                    Cep = "20040-030",
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-4)
                },
                new()
                {
                    Nome = "Mariana Oliveira Silva",
                    Email = "mariana.silva@gmail.com",
                    Documento = "123.456.789-00",
                    Telefone = "(31) 99123-4567",
                    Endereco = "Rua das Flores, 245 - Savassi",
                    Cidade = "Belo Horizonte",
                    Estado = "MG",
                    Cep = "30140-000",
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-3)
                },
                new()
                {
                    Nome = "Lucas Pereira Santos",
                    Email = "lucas.santos@outlook.com",
                    Documento = "321.654.987-11",
                    Telefone = "(41) 98877-6655",
                    Endereco = "Av. Sete de Setembro, 3200 - Batel",
                    Cidade = "Curitiba",
                    Estado = "PR",
                    Cep = "80240-000",
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-2)
                },
                new()
                {
                    Nome = "Vanguarda Comércio e Varejo",
                    Email = "suprimentos@vanguarda.com",
                    Documento = "45.678.901/0001-23",
                    Telefone = "(51) 99888-7766",
                    Endereco = "Rua dos Andradas, 1200 - Centro",
                    Cidade = "Porto Alegre",
                    Estado = "RS",
                    Cep = "90020-008",
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-1)
                }
            };

            await context.Clientes.AddRangeAsync(clientes);
            await context.SaveChangesAsync();
        }

        // 3. Seed Produtos
        if (!await context.Produtos.AnyAsync())
        {
            var produtos = new List<Produto>
            {
                new()
                {
                    Nome = "Notebook Dell Inspiron 15",
                    Descricao = "Processador Intel Core i7 16GB RAM 512GB SSD Tela 15.6' FHD",
                    Sku = "NOT-DELL-I15",
                    Preco = 4599.90m,
                    Estoque = 25,
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-5)
                },
                new()
                {
                    Nome = "Monitor LG UltraWide 29''",
                    Descricao = "Monitor IPS Full HD UltraWide 29WL500 com HDR10",
                    Sku = "MON-LG-29UW",
                    Preco = 1299.00m,
                    Estoque = 15,
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-5)
                },
                new()
                {
                    Nome = "Teclado Mecânico RGB Wireless",
                    Descricao = "Teclado mecânico switch brown, layout ABNT2 e conectividade Bluetooth",
                    Sku = "TEC-MEC-RGB",
                    Preco = 389.90m,
                    Estoque = 4, // Estoque crítico (< 5)
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-4)
                },
                new()
                {
                    Nome = "Mouse Ergonômico MX Master 3S",
                    Descricao = "Sensor 8K DPI Darkfield, clique silencioso, scroll eletromagnético MagSpeed",
                    Sku = "MOU-MXM-3S",
                    Preco = 549.00m,
                    Estoque = 3, // Estoque crítico (< 5)
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-4)
                },
                new()
                {
                    Nome = "Cadeira Ergonômica Presidente",
                    Descricao = "Suporte lombar 3D, braços ajustáveis e malha mesh respirável",
                    Sku = "CAD-ERG-PRES",
                    Preco = 1150.00m,
                    Estoque = 12,
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-3)
                },
                new()
                {
                    Nome = "Headset Gamer Sem Fio 7.1",
                    Descricao = "Áudio surround 7.1 espacial, microfone com cancelamento de ruído",
                    Sku = "HEA-GAM-71W",
                    Preco = 499.99m,
                    Estoque = 2, // Estoque crítico (< 5)
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow.AddMonths(-2)
                }
            };

            await context.Produtos.AddRangeAsync(produtos);
            await context.SaveChangesAsync();
        }

        // 4. Seed Pedidos
        if (!await context.Pedidos.AnyAsync())
        {
            var clientes = await context.Clientes.ToListAsync();
            var produtos = await context.Produtos.ToListAsync();

            if (clientes.Count >= 3 && produtos.Count >= 4)
            {
                var pedidos = new List<Pedido>
                {
                    new()
                    {
                        ClienteId = clientes[0].Id,
                        DataPedido = DateTime.UtcNow.AddDays(-15),
                        Status = StatusPedido.Concluido,
                        Desconto = 100.00m,
                        Observacoes = "Entrega prioritária no departamento de TI",
                        CriadoEm = DateTime.UtcNow.AddDays(-15),
                        Itens = new List<PedidoItem>
                        {
                            new() { ProdutoId = produtos[0].Id, Quantidade = 2, PrecoUnitario = produtos[0].Preco },
                            new() { ProdutoId = produtos[1].Id, Quantidade = 2, PrecoUnitario = produtos[1].Preco }
                        }
                    },
                    new()
                    {
                        ClienteId = clientes[1].Id,
                        DataPedido = DateTime.UtcNow.AddDays(-8),
                        Status = StatusPedido.Enviado,
                        Desconto = 50.00m,
                        Observacoes = "Faturamento para 30 dias",
                        CriadoEm = DateTime.UtcNow.AddDays(-8),
                        Itens = new List<PedidoItem>
                        {
                            new() { ProdutoId = produtos[2].Id, Quantidade = 1, PrecoUnitario = produtos[2].Preco },
                            new() { ProdutoId = produtos[3].Id, Quantidade = 1, PrecoUnitario = produtos[3].Preco }
                        }
                    },
                    new()
                    {
                        ClienteId = clientes[2].Id,
                        DataPedido = DateTime.UtcNow.AddDays(-2),
                        Status = StatusPedido.Processando,
                        Desconto = 0m,
                        Observacoes = "Presente de aniversário para equipe",
                        CriadoEm = DateTime.UtcNow.AddDays(-2),
                        Itens = new List<PedidoItem>
                        {
                            new() { ProdutoId = produtos[4].Id, Quantidade = 1, PrecoUnitario = produtos[4].Preco }
                        }
                    },
                    new()
                    {
                        ClienteId = clientes[0].Id,
                        DataPedido = DateTime.UtcNow.AddHours(-5),
                        Status = StatusPedido.Pendente,
                        Desconto = 0m,
                        Observacoes = "Aguardando confirmação financeira",
                        CriadoEm = DateTime.UtcNow.AddHours(-5),
                        Itens = new List<PedidoItem>
                        {
                            new() { ProdutoId = produtos[5].Id, Quantidade = 2, PrecoUnitario = produtos[5].Preco }
                        }
                    }
                };

                foreach (var pedido in pedidos)
                {
                    pedido.CalcularTotal();
                }

                await context.Pedidos.AddRangeAsync(pedidos);
                await context.SaveChangesAsync();
            }
        }
    }
}
