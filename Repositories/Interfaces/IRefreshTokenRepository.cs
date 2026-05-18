using FurniShop.API.Repositories.Interfaces;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
        Task<IEnumerable<RefreshToken>> GetActiveTokensByUserAsync(Guid userId);
        Task RevokeAllUserTokensAsync(Guid userId);
    }
}
