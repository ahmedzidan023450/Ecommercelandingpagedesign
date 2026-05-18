using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByEmailVerificationTokenAsync(string token);
        Task<User?> GetByPasswordResetTokenAsync(string tokenHash);
        Task<User?> GetWithOrdersAsync(Guid userId);
        Task<IEnumerable<User>> GetAllCustomersAsync();
        Task<IEnumerable<User>> GetBlockedCustomersAsync();
    }
}
