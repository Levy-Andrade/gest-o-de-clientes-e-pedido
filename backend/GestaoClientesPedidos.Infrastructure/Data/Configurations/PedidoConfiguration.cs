using GestaoClientesPedidos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoClientesPedidos.Infrastructure.Data.Configurations;

public class PedidoConfiguration : IEntityTypeConfiguration<Pedido>
{
    public void Configure(EntityTypeBuilder<Pedido> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(p => p.ValorTotal).HasPrecision(18, 2);
        builder.Property(p => p.Desconto).HasPrecision(18, 2);
        builder.Property(p => p.Observacoes).HasMaxLength(500);

        builder.HasMany(p => p.Itens)
               .WithOne(i => i.Pedido)
               .HasForeignKey(i => i.PedidoId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
