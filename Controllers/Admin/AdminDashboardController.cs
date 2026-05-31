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

        public AdminDashboardController(
            IAdminDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // =========================================
        // DASHBOARD STATS
        // =========================================

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result =
                await _dashboardService
                    .GetDashboardStatsAsync();

            return Ok(result);
        }

        // =========================================
        // MONTHLY REVENUE
        // =========================================

        [HttpGet("revenue")]
        public async Task<IActionResult> GetMonthlyRevenue(
            [FromQuery] int months = 12)
        {
            var result =
                await _dashboardService
                    .GetMonthlyRevenueAsync(months);

            return Ok(result);
        }

        // =========================================
        // EXPORT PDF REPORT
        // =========================================

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportDashboardPdf()
        {
            var pdfBytes =
                await _dashboardService
                    .ExportDashboardPdfAsync();

            return File(
                pdfBytes,
                "application/pdf",
                $"dashboard-report-{DateTime.Now:yyyyMMddHHmmss}.pdf");
        }
    }
}