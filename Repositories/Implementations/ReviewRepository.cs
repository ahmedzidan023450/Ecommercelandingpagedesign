using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        // =========================
        // Get product reviews
        // =========================
        public async Task<IEnumerable<Review>> GetByProductAsync(Guid productId, bool includeHidden = false)
        {
            var query = _context.Reviews
                .Where(r => r.ProductId == productId);

            if (!includeHidden)
            {
                query = query.Where(r => !r.IsHidden);
            }

            return await query
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // =========================
        // Get user review for product
        // =========================
        public async Task<Review?> GetByUserAndProductAsync(Guid userId, Guid productId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId &&
                    r.ProductId == productId);
        }

        // =========================
        // Rating stats
        // =========================
        public async Task<(decimal Average, int Count)> GetRatingStatsAsync(Guid productId)
        {
            var reviews = _context.Reviews
                .Where(r => r.ProductId == productId && !r.IsHidden);

            var count = await reviews.CountAsync();

            if (count == 0)
                return (0, 0);

            var avg = await reviews.AverageAsync(r => r.Rating);

            return (avg, count);
        }

        // =========================
        // Admin pagination
        // =========================
        public async Task<(IEnumerable<Review> Items, int TotalCount)>
            GetPagedForAdminAsync(int page, int pageSize, bool? isHidden = null)
        {
            var query = _context.Reviews.AsQueryable();

            if (isHidden.HasValue)
            {
                query = query.Where(r => r.IsHidden == isHidden.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Include(r => r.User)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}