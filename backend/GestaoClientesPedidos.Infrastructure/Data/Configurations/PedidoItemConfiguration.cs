using GestaoClientesPedidos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoClientesPedidos.Infrastructure.Data.Configurations;

public class PedidoItemConfiguration : IEntityTypeConfiguration<PedidoItem>
{
    public void Configure(EntityTypeBuilder<PedidoItem> builder)
    {
        builder.HasKey(pi => pi.Id);
        builder.Property(pi => pi.PrecoUnitario).HasPrecision(18, 2);

        builder.HasOne(pi => pi.Produto)
               .WithMany(p => p.Itens)
               .HasForeignKey(pi => pi.ProdutoId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
