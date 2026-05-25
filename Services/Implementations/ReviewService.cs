using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepo;
        private readonly IOrderRepository _orderRepo;

        public ReviewService(
            IReviewRepository reviewRepo,
            IOrderRepository orderRepo)
        {
            _reviewRepo = reviewRepo;
            _orderRepo = orderRepo;
        }

        // =========================
        // GET PRODUCT REVIEWS
        // =========================
        public async Task<IEnumerable<ReviewDto>> GetProductReviewsAsync(int productId)
        {
            var reviews = await _reviewRepo.Query()
                .Where(r => r.ProductId == productId && !r.IsHidden)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews.Adapt<IEnumerable<ReviewDto>>();
        }

        // =========================
        // ADD REVIEW
        // =========================
        public async Task AddReviewAsync(int userId, CreateReviewDto dto)
        {
            // 1. Check if user bought this product (verified purchase)
            var hasPurchased = await _orderRepo.Query()
                .Include(o => o.Items)
                .AnyAsync(o =>
                    o.UserId == userId &&
                    o.Status == Models.Enums.OrderStatus.Delivered &&
                    o.Items.Any(i => i.ProductId == dto.ProductId));

            var review = new Review
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                IsVerifiedPurchase = hasPurchased
            };

            await _reviewRepo.AddAsync(review);
            await _reviewRepo.SaveChangesAsync();
        }

        // =========================
        // DELETE REVIEW
        // =========================
        public async Task DeleteReviewAsync(int userId, int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);

            if (review == null)
                throw new Exception("Review not found");

            if (review.UserId != userId)
                throw new Exception("Unauthorized");

            _reviewRepo.Delete(review);
            await _reviewRepo.SaveChangesAsync();
        }
    }
}