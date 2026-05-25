using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {

        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByEmailVerificationTokenAsync(string token);

        Task<User?> GetByPasswordResetTokenAsync(string tokenHash);

        Task<User?> GetWithOrdersAsync(int userId);

        Task<IEnumerable<User>> GetCustomersAsync();

        Task<IEnumerable<User>> GetBlockedUsersAsync();
        Task<bool> IsEmailExistsAsync(string email);
    }
}