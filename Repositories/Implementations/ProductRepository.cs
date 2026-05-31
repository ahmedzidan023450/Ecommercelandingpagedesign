using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context) { }

        // ← REMOVED duplicate Query() override

        public async Task<Product?> GetBySlugAsync(string slug)
        {
            return await _context.Products
                .Include(x => x.Images)
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Slug == slug);
        }

        public async Task<Product?> GetWithDetailsAsync(int productId)
        {
            return await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Discount)
                .FirstOrDefaultAsync(p => p.Id == productId);
        }

        public async Task<Product?> GetWithReviewsAsync(int id)
        {
            return await _context.Products
                .Include(x => x.Reviews)
                    .ThenInclude(r => r.User)
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
            var query = _context.Products
                .Include(x => x.Images)      // ← was missing
                .Include(x => x.Category)    // ← was missing
                .Include(x => x.Discount)    // ← was missing
                .AsNoTracking();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Name.Contains(search));

            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId);

            if (minPrice.HasValue)
                query = query.Where(x => x.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(x => x.Price <= maxPrice);

            query = sortBy switch
            {
                "price" => sortDesc
                    ? query.OrderByDescending(x => x.Price)
                    : query.OrderBy(x => x.Price),
                "rating" => sortDesc
                    ? query.OrderByDescending(x => x.AverageRating)
                    : query.OrderBy(x => x.AverageRating),
                "name" => sortDesc
                    ? query.OrderByDescending(x => x.Name)
                    : query.OrderBy(x => x.Name),
                _ => query.OrderByDescending(x => x.CreatedAt) // default
            };

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
                .Include(x => x.Images)
                .Where(x => x.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockAsync(int threshold = 10)
        {
            return await _context.Products
                .Where(x => x.StockQuantity <= threshold)
                .OrderBy(x => x.StockQuantity)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetTopSellingAsync(int count = 10)
        {
            return await _context.Products
                .Include(x => x.Images)
                .OrderByDescending(x => x.SoldCount)
                .Take(count)
                .ToListAsync();
        }

        public async Task AddImagesAsync(List<ProductImage> images)
        {
            await _context.ProductImages.AddRangeAsync(images);
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
            await _context.SaveChangesAsync();  // ← was missing SaveChanges
        }

        public async Task UpdateRatingAsync(int productId, decimal avgRating, int reviewCount)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return;

            product.AverageRating = avgRating;
            product.ReviewCount = reviewCount;
            await _context.SaveChangesAsync();  // ← was missing SaveChanges
        }
    }
}