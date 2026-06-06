using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Review>> GetByProductAsync(int productId, bool includeHidden = false)
        {
            var query = _context.Reviews.Where(x => x.ProductId == productId);

            if (!includeHidden)
                query = query.Where(x => !x.IsHidden);

            return await query.ToListAsync();
        }

        public async Task<Review?> GetByUserAndProductAsync(int userId, int productId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId);
        }

        public async Task<(decimal Average, int Count)> GetRatingStatsAsync(int productId)
        {
            var reviews = _context.Reviews
                .Where(r => r.ProductId == productId && !r.IsHidden);

            var count = await reviews.CountAsync();

            if (count == 0)
                return (0m, 0);

            decimal avg = (decimal)await reviews.AverageAsync(r => r.Rating);

            return (avg, count);
        }

        public async Task<(IEnumerable<Review> Items, int TotalCount)> GetPagedForAdminAsync(
            int page,
            int pageSize,
            bool? isHidden = null)
        {
            var query = _context.Reviews.AsQueryable();

            if (isHidden.HasValue)
                query = query.Where(x => x.IsHidden == isHidden);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }
    }
}