using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<Product?> GetBySlugAsync(string slug)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task<Product?> GetWithDetailsAsync(Guid id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Discount)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product?> GetWithReviewsAsync(Guid id)
        {
            return await _context.Products
                .Include(p => p.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<(IEnumerable<Product> Items, int TotalCount)>
            GetPagedAsync(
                int page,
                int pageSize,
                string? search = null,
                int? categoryId = null,
                decimal? minPrice = null,
                decimal? maxPrice = null,
                string? sortBy = null,
                bool sortDesc = false)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Description.Contains(search));
            }

            // Category
            if (categoryId.HasValue)
            {
                query = query.Where(p =>
                    p.CategoryId == categoryId.Value);
            }

            // Price Range
            if (minPrice.HasValue)
            {
                query = query.Where(p =>
                    p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p =>
                    p.Price <= maxPrice.Value);
            }

            // Sorting
            query = sortBy?.ToLower() switch
            {
                "price" => sortDesc
                    ? query.OrderByDescending(p => p.Price)
                    : query.OrderBy(p => p.Price),

                "name" => sortDesc
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name),

                "rating" => sortDesc
                    ? query.OrderByDescending(p => p.AverageRating)
                    : query.OrderBy(p => p.AverageRating),

                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Images)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockAsync(int threshold = 10)
        {
            return await _context.Products
                .Where(p => p.StockQuantity <= threshold)
                .OrderBy(p => p.StockQuantity)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetTopSellingAsync(int count = 10)
        {
            return await _context.Products
                .OrderByDescending(p =>
                    p.OrderItems.Sum(oi => oi.Quantity))
                .Take(count)
                .Include(p => p.Images)
                .ToListAsync();
        }

        public async Task<bool> SlugExistsAsync(
            string slug,
            Guid? excludeId = null)
        {
            return await _context.Products.AnyAsync(p =>
                p.Slug == slug &&
                (!excludeId.HasValue || p.Id != excludeId.Value));
        }

        public async Task UpdateStockAsync(Guid productId, int delta)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product != null)
            {
                product.StockQuantity += delta;
            }
        }

        public async Task UpdateRatingAsync(
            Guid productId,
            decimal avgRating,
            int reviewCount)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product != null)
            {
                product.AverageRating = avgRating;
                product.ReviewCount = reviewCount;
            }
        }
    }
}