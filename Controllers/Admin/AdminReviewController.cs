using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/reviews")]
    [Authorize(Roles = "Admin")]
    public class AdminReviewsController : ControllerBase
    {
        private readonly IAdminReviewService _adminService;

        public AdminReviewsController(IAdminReviewService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews(
            int page = 1,
            int pageSize = 10,
            bool? isHidden = null)
        {
            var result = await _adminService
                .GetReviewsPagedAsync(page, pageSize, isHidden);

            return Ok(result);
        }

        [HttpPatch("{id:int}/hide")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HideReview(int id)
        {
            await _adminService.HideReviewAsync(id);

            return Ok(new
            {
                Message = "Review hidden successfully"
            });
        }

        [HttpPatch("{id:int}/unhide")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> UnhideReview(int id)
        {
            await _adminService.UnhideReviewAsync(id);

            return Ok(new
            {
                Message = "Review unhidden successfully"
            });
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            await _adminService.DeleteReviewAsync(id);

            return Ok(new
            {
                Message = "Review deleted successfully"
            });
        }
    }
}