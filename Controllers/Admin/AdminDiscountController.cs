using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/discounts")]
    public class AdminDiscountsController : ControllerBase
    {
        private readonly IAdminDiscountService _adminService;

        public AdminDiscountsController(IAdminDiscountService adminService)
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
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> CreateDiscount(
            [FromBody] CreateDiscountDto dto)
        {
            var result = await _adminService.CreateDiscountAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
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