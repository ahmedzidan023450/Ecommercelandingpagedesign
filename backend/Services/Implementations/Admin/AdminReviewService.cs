using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminReviewService : IAdminReviewService
    {
        private readonly IReviewRepository _reviewRepo;

        public AdminReviewService(IReviewRepository reviewRepo)
        {
            _reviewRepo = reviewRepo;
        }

        public async Task<(IEnumerable<ReviewDto> Items, int TotalCount)>
            GetReviewsPagedAsync(int page, int pageSize, bool? isHidden = null)
        {
            var query = _reviewRepo.Query().AsNoTracking();

            if (isHidden.HasValue)
                query = query.Where(r => r.IsHidden == isHidden.Value);

            var totalCount = await query.CountAsync();

            var reviews = await query
                .Include(r => r.User)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (reviews.Adapt<IEnumerable<ReviewDto>>(), totalCount);
        }

        public async Task HideReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            review.IsHidden = true;
            _reviewRepo.Update(review);
            await _reviewRepo.SaveChangesAsync();
        }

        public async Task UnhideReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            review.IsHidden = false;
            _reviewRepo.Update(review);
            await _reviewRepo.SaveChangesAsync();
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            _reviewRepo.Delete(review);
            await _reviewRepo.SaveChangesAsync();
        }
    }
}