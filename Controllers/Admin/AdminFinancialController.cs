using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/financial")]
    [Authorize(Roles = "Admin")]
    public class AdminFinancialController : ControllerBase
    {
        private readonly IAdminFinancialService _financialService;

        public AdminFinancialController(IAdminFinancialService financialService)
        {
            _financialService = financialService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRecords(
            [FromQuery] int month = 0,
            [FromQuery] int year = 0)
        {
            month = month == 0 ? DateTime.UtcNow.Month : month;
            year = year == 0 ? DateTime.UtcNow.Year : year;

            var result = await _financialService.GetFinancialRecordsAsync(month, year);
            return Ok(result);
        }

        [HttpGet("totals")]
        public async Task<IActionResult> GetTotals()
        {
            var revenue = await _financialService.GetTotalRevenueAsync();
            var expenses = await _financialService.GetTotalExpensesAsync();

            return Ok(new
            {
                TotalRevenue = revenue,
                TotalExpenses = expenses,
                NetProfit = revenue - expenses
            });
        }

        [HttpPost("expense")]
        public async Task<IActionResult> AddExpense([FromBody] CreateFinancialRecordDto dto)
        {
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "Admin";
            await _financialService.AddExpenseAsync(dto, adminId);
            return NoContent();
        }
    }
}