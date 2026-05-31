// =============================
// IReviewService
// =============================

using Furniture_E_Commerce.DTOs.Reviews;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>>
            GetProductReviewsAsync(int productId);

        Task AddReviewAsync(
            int userId,
            CreateReviewDto dto);

        Task DeleteReviewAsync(
            int userId,
            int reviewId);
    }
}