using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context) { }

        public IQueryable<Product> Query() => _context.Set<Product>();

        public async Task<Product?> GetBySlugAsync(string slug)
        {
            return await _context.Products
                .FirstOrDefaultAsync(x => x.Slug == slug);
        }

        public async Task<Product?> GetWithDetailsAsync(int id)
        {
            return await _context.Products
                .Include(x => x.Images)
                .Include(x => x.Category)
                .Include(x => x.Discount)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Product?> GetWithReviewsAsync(int id)
        {
            return await _context.Products
                .Include(x => x.Reviews)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
            int page,
            int pageSize,
            string? search = null,
            int? categoryId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            string? sortBy = null,
            bool sortDesc = false)
        {
            var query = _context.Products.AsNoTracking();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Name.Contains(search));

            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId);

            if (minPrice.HasValue)
                query = query.Where(x => x.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(x => x.Price <= maxPrice);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Where(x => x.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockAsync(int threshold = 10)
        {
            return await _context.Products
                .Where(x => x.StockQuantity <= threshold)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetTopSellingAsync(int count = 10)
        {
            return await _context.Products
                .OrderByDescending(x => x.SoldCount)
                .Take(count)
                .ToListAsync();
        }

        public async Task<bool> SlugExistsAsync(string slug, int? excludeId = null)
        {
            return await _context.Products.AnyAsync(x =>
                x.Slug == slug && (!excludeId.HasValue || x.Id != excludeId));
        }

        public async Task UpdateStockAsync(int productId, int delta)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return;

            product.StockQuantity += delta;
        }

        public async Task UpdateRatingAsync(int productId, decimal avgRating, int reviewCount)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return;

            product.AverageRating = avgRating;
            product.ReviewCount = reviewCount;
        }
    }
}