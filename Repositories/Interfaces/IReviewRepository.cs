using FurniShop.API.Repositories.Interfaces;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetByProductAsync(Guid productId, bool includeHidden = false);
        Task<Review?> GetByUserAndProductAsync(Guid userId, Guid productId);
        Task<(decimal Average, int Count)> GetRatingStatsAsync(Guid productId);
        Task<(IEnumerable<Review> Items, int TotalCount)> GetPagedForAdminAsync(
            int page, int pageSize, bool? isHidden = null);
    }
}
