using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {

        Task<IEnumerable<Review>> GetByProductAsync(int productId, bool includeHidden = false);

        Task<Review?> GetByUserAndProductAsync(int userId, int productId);

        Task<(decimal Average, int Count)> GetRatingStatsAsync(int productId);

        Task<(IEnumerable<Review> Items, int TotalCount)> GetPagedForAdminAsync(
            int page,
            int pageSize,
            bool? isHidden = null);
    }
}