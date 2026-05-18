using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByEmailVerificationTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string tokenHash)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.PasswordResetToken == tokenHash);
        }

        public async Task<User?> GetWithOrdersAsync(Guid userId)
        {
            return await _context.Users
                .Include(u => u.Orders)
                    .ThenInclude(o => o.Items)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<IEnumerable<User>> GetAllCustomersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == UserRole.Customer)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetBlockedCustomersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == UserRole.Customer && u.IsBlocked)
                .ToListAsync();
        }
    }
}