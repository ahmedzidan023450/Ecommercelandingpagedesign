using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _dashboardService;

        public AdminDashboardController(IAdminDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // =========================
        // MAIN STATS
        // =========================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _dashboardService.GetDashboardStatsAsync();
            return Ok(result);
        }

        // =========================
        // CHART DATA (Revenue trend)
        // =========================
        [HttpGet("revenue")]
        public async Task<IActionResult> GetMonthlyRevenue([FromQuery] int months = 12)
        {
            var result = await _dashboardService.GetMonthlyRevenueAsync(months);
            return Ok(result);
        }
    }
}