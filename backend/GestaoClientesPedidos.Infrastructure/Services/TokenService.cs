using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GestaoClientesPedidos.Core.Entities;
using GestaoClientesPedidos.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GestaoClientesPedidos.Infrastructure.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Usuario usuario)
    {
        var secretKey = _configuration["Jwt:Key"] ?? "MinhaChaveSuperSecretaDeAltaSegurancaParaGestaoClientesPedidos2026";
        var issuer = _configuration["Jwt:Issuer"] ?? "GestaoClientesPedidos";
        var audience = _configuration["Jwt:Audience"] ?? "GestaoClientesPedidosClient";
        var expireHours = int.TryParse(_configuration["Jwt:ExpireHours"], out var hours) ? hours : 8;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Name, usuario.Nome),
            new(ClaimTypes.Email, usuario.Email),
            new(ClaimTypes.Role, usuario.Perfil.ToString()),
            new("Perfil", usuario.Perfil.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(expireHours),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public DateTime GetExpirationDate()
    {
        var expireHours = int.TryParse(_configuration["Jwt:ExpireHours"], out var hours) ? hours : 8;
        return DateTime.UtcNow.AddHours(expireHours);
    }
}
