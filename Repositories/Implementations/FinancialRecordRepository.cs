using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class FinancialRecordRepository : GenericRepository<FinancialRecord>, IFinancialRecordRepository
    {
        public FinancialRecordRepository(ApplicationDbContext context) : base(context) { }

        public IQueryable<FinancialRecord> Query() => _context.Set<FinancialRecord>();

        public async Task<IEnumerable<FinancialRecord>> GetByMonthYearAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(x => x.Month == month && x.Year == year)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(x => x.Month == month && x.Year == year && x.Type == Models.Enums.FinancialRecordType.Revenue)
                .SumAsync(x => x.Amount);
        }

        public async Task<decimal> GetTotalExpensesAsync(int month, int year)
        {
            return await _context.FinancialRecords
                .Where(x => x.Month == month && x.Year == year && x.Type == Models.Enums.FinancialRecordType.Expense)
                .SumAsync(x => x.Amount);
        }

        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months)
        {
            return await _context.FinancialRecords
                .GroupBy(x => new { x.Month, x.Year })
                .Select(g => new MonthlyRevenueDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Revenue = g.Sum(x => x.Amount)
                })
                .ToListAsync();
        }
    }
}