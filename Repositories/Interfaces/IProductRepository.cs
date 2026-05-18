using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product?> GetBySlugAsync(string slug);
        Task<Product?> GetWithDetailsAsync(Guid id);           // includes images, category, discount
        Task<Product?> GetWithReviewsAsync(Guid id);
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
        Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null);
        Task UpdateStockAsync(Guid productId, int delta);        // atomic SQL update
        Task UpdateRatingAsync(Guid productId, decimal avgRating, int reviewCount);
    }
}
