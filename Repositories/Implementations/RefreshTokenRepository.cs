using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
        }

        public async Task<IEnumerable<RefreshToken>> GetActiveTokensByUserAsync(int userId)
        {
            return await _context.RefreshTokens
                .Where(t => t.UserId == userId && !t.IsRevoked)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task RevokeAllUserTokensAsync(int userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(t => t.UserId == userId && !t.IsRevoked)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }
        }
    }
}