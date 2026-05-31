using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<Product?> GetBySlugAsync(string slug);
    Task<Product?> GetWithDetailsAsync(int id);
    Task<Product?> GetWithReviewsAsync(int id);
    Task AddImagesAsync(List<ProductImage> images);   // ← ADD
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize,
        string? search = null,
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        string? sortBy = null,
        bool sortDesc = false);
    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    Task<IEnumerable<Product>> GetLowStockAsync(int threshold = 10);
    Task<IEnumerable<Product>> GetTopSellingAsync(int count = 10);
    Task<bool> SlugExistsAsync(string slug, int? excludeId = null);
    Task UpdateStockAsync(int productId, int delta);
    Task UpdateRatingAsync(int productId, decimal avgRating, int reviewCount);
}