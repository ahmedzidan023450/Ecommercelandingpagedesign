using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IAdminOrderService _adminService;

        public AdminOrdersController(IAdminOrderService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders(
            int page = 1,
            int pageSize = 10,
            OrderStatus? status = null)
        {
            var (items, totalCount) = await _adminService.GetOrdersPagedAsync(page, pageSize, status);
            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var result = await _adminService.GetOrderDetailsAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        // keep only PATCH, remove the duplicate HttpPut
        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                await _adminService.UpdateOrderStatusAsync(id, dto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}