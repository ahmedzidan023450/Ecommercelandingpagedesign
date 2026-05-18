using Furniture_E_Commerce.DTOs;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IFinancialRecordRepository : IGenericRepository<FinancialRecord>
    {
        Task<IEnumerable<FinancialRecord>> GetByMonthYearAsync(int month, int year);
        Task<decimal> GetTotalRevenueAsync(int month, int year);
        Task<decimal> GetTotalExpensesAsync(int month, int year);

        Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months);
    }
}