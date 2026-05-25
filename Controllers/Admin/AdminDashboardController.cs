using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminDashboardController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _adminService.GetDashboardStatsAsync();
            return Ok(result);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetMonthlyRevenue([FromQuery] int months = 12)
        {
            var result = await _adminService.GetMonthlyRevenueAsync(months);
            return Ok(result);
        }

        [HttpGet("financial/revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var result = await _adminService.GetTotalRevenueAsync();
            return Ok(result);
        }

        [HttpGet("financial/expenses")]
        public async Task<IActionResult> GetTotalExpenses()
        {
            var result = await _adminService.GetTotalExpensesAsync();
            return Ok(result);
        }
    }
}