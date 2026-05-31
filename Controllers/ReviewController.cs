using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Furniture_E_Commerce.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    [Authorize(Roles = "Customer")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _service;

        public ReviewController(IReviewService service)
        {
            _service = service;
        }

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // =========================
        // GET PRODUCT REVIEWS
        // =========================
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            var result = await _service.GetProductReviewsAsync(productId);
            return Ok(result);
        }

        // =========================
        // ADD REVIEW
        // =========================
        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] CreateReviewDto dto)
        {
            await _service.AddReviewAsync(UserId, dto);
            return Ok(new { message = "Review added successfully" });
        }

        // =========================
        // DELETE REVIEW
        // =========================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            await _service.DeleteReviewAsync(UserId, id);
            return Ok(new { message = "Review deleted successfully" });
        }
    }
}