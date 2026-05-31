using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class DiscountRepository : GenericRepository<Discount>, IDiscountRepository
    {
        private readonly ApplicationDbContext _context;

        public DiscountRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Discount>> GetActiveAsync()
        {
            var now = DateTime.UtcNow;

            return await _context.Discounts
                .Where(d => d.IsActive
                         && d.StartDate <= now
                         && d.EndDate >= now)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }
    }
}