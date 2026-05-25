using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/financial")]
    public class AdminFinancialController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminFinancialController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            var revenue = await _adminService.GetTotalRevenueAsync();

            return Ok(new
            {
                TotalRevenue = revenue
            });
        }

        [HttpGet("expenses")]
        public async Task<IActionResult> GetTotalExpenses()
        {
            var expenses = await _adminService.GetTotalExpensesAsync();

            return Ok(new
            {
                TotalExpenses = expenses
            });
        }

        [HttpGet("records")]
        public async Task<IActionResult> GetFinancialRecords(
            int month,
            int year)
        {
            var result = await _adminService
                .GetFinancialRecordsAsync(month, year);

            return Ok(result);
        }
    }
}