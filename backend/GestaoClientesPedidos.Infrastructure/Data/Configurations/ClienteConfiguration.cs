using GestaoClientesPedidos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestaoClientesPedidos.Infrastructure.Data.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Nome).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Email).IsRequired().HasMaxLength(150);
        builder.HasIndex(c => c.Email);
        builder.Property(c => c.Documento).IsRequired().HasMaxLength(20);
        builder.HasIndex(c => c.Documento).IsUnique();
        builder.Property(c => c.Telefone).HasMaxLength(20);
        builder.Property(c => c.Endereco).HasMaxLength(200);
        builder.Property(c => c.Cidade).HasMaxLength(100);
        builder.Property(c => c.Estado).HasMaxLength(50);
        builder.Property(c => c.Cep).HasMaxLength(20);

        builder.HasMany(c => c.Pedidos)
               .WithOne(p => p.Cliente)
               .HasForeignKey(p => p.ClienteId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
