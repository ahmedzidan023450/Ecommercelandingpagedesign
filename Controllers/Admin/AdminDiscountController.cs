using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/discounts")]
    public class AdminDiscountsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminDiscountsController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDiscounts()
        {
            var result = await _adminService.GetDiscountsAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDiscount(
            [FromBody] CreateDiscountDto dto)
        {
            var result = await _adminService.CreateDiscountAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            await _adminService.DeleteDiscountAsync(id);
            return Ok(new
            {
                Message = "Discount deleted successfully"
            });
        }
    }
}