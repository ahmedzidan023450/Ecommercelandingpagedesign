using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminFinancialService : IAdminFinancialService
    {
        private readonly IFinancialRecordRepository _financialRepo;

        public AdminFinancialService(IFinancialRecordRepository financialRepo)
        {
            _financialRepo = financialRepo;
        }

        public async Task<IEnumerable<FinancialRecordDto>> GetFinancialRecordsAsync(int month, int year)
        {
            var data = await _financialRepo.GetByMonthYearAsync(month, year);
            return data.Adapt<IEnumerable<FinancialRecordDto>>();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _financialRepo.Query().AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);
        }

        public async Task<decimal> GetTotalExpensesAsync()
        {
            return await _financialRepo.Query().AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Expense)
                .SumAsync(f => f.Amount);
        }
    }
}