using Furniture_E_Commerce.DTOs.Reviews;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IReviewService
    {
        Task<(IEnumerable<ReviewDto> Items, int TotalCount)> GetReviewsPagedAsync(
            int page, int pageSize, bool? isHidden = null);
        Task HideReviewAsync(int reviewId);
        Task UnhideReviewAsync(int reviewId);
        Task DeleteReviewAsync(int reviewId);
    }
}