using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations 
{
    public class FinancialRecordRepository : GenericRepository<FinancialRecord>, IFinancialRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public FinancialRecordRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        // =========================
        // Get by Month/Year
        // =========================
        public async Task<IEnumerable<FinancialRecord>> GetByMonthYearAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(f => f.Month == month && f.Year == year)
                .OrderByDescending(f => f.RecordedAt)
                .ToListAsync();
        }

        // =========================
        // Total Revenue
        // =========================
        public async Task<decimal> GetTotalRevenueAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(f =>
                    f.Month == month &&
                    f.Year == year &&
                    f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);
        }

        // =========================
        // Total Expenses
        // =========================
        public async Task<decimal> GetTotalExpensesAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(f =>
                    f.Month == month &&
                    f.Year == year &&
                    f.Type == FinancialRecordType.Expense)
                .SumAsync(f => f.Amount);
        }

        // =========================
        // Monthly Revenue (last N months)
        // =========================
        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months)
        {
            var fromDate = DateTime.UtcNow.AddMonths(-months);

            return await _context.FinancialRecords
                .Where(f =>
                    f.Type == FinancialRecordType.Revenue &&
                    f.RecordedAt >= fromDate)
                .GroupBy(f => new { f.Month, f.Year })
                .Select(g => new MonthlyRevenueDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Revenue = g.Sum(x => x.Amount)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();
        }

        // =========================
        // Optional: Order-based lookup
        // =========================
        public async Task<IEnumerable<FinancialRecord>> GetByOrderIdAsync(Guid orderId)
        {
            return await _context.FinancialRecords
                .Where(f => f.OrderId == orderId)
                .ToListAsync();
        }
    }
}