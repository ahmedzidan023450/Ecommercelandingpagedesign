using Furniture_E_Commerce.DTOs.Financial;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IFinancialService
    {
        Task<IEnumerable<FinancialRecordDto>> GetFinancialRecordsAsync(int month, int year);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetTotalExpensesAsync();
    }
}