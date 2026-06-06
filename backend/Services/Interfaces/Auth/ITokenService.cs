using Furniture_E_Commerce.Models;

public interface ITokenService
{
    string GenerateToken(User user);
}