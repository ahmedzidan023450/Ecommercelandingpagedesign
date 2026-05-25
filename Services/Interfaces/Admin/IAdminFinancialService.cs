using Furniture_E_Commerce.DTOs.Financial;

namespace Furniture_E_Commerce.Services.Interfaces.Admin
{
    public interface IAdminFinancialService
    {
        Task<IEnumerable<FinancialRecordDto>> GetFinancialRecordsAsync(int month, int year);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetTotalExpensesAsync();
    }
}