using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/reviews")]
    public class AdminReviewsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminReviewsController(IAdminService adminService)
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
        public async Task<IActionResult> HideReview(int id)
        {
            await _adminService.HideReviewAsync(id);

            return Ok(new
            {
                Message = "Review hidden successfully"
            });
        }

        [HttpPatch("{id:int}/unhide")]
        public async Task<IActionResult> UnhideReview(int id)
        {
            await _adminService.UnhideReviewAsync(id);

            return Ok(new
            {
                Message = "Review unhidden successfully"
            });
        }

        [HttpDelete("{id:int}")]
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