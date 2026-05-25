using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context) { }

        public IQueryable<User> Query() => _context.Set<User>();

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User?> GetByEmailVerificationTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.EmailVerificationToken == token);
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string tokenHash)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.PasswordResetToken == tokenHash);
        }

        public async Task<User?> GetWithOrdersAsync(int userId)
        {
            return await _context.Users
                .Include(x => x.Orders)
                .ThenInclude(o => o.Items)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }

        public async Task<IEnumerable<User>> GetCustomersAsync()
        {
            return await _context.Users
                .Where(x => x.Role == UserRole.Customer)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetBlockedUsersAsync()
        {
            return await _context.Users
                .Where(x => x.IsBlocked)
                .ToListAsync();
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }
    }
}