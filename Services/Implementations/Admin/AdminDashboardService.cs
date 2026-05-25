using Furniture_E_Commerce.DTOs.Dashboard;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IUserRepository _userRepo;
        private readonly IProductRepository _productRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IFinancialRecordRepository _financialRepo;

        public AdminDashboardService(
            IUserRepository userRepo,
            IProductRepository productRepo,
            IOrderRepository orderRepo,
            IFinancialRecordRepository financialRepo)
        {
            _userRepo = userRepo;
            _productRepo = productRepo;
            _orderRepo = orderRepo;
            _financialRepo = financialRepo;
        }

        // =========================
        // MAIN STATS (Dashboard KPIs)
        // =========================
        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _userRepo.CountAsync();
            var totalOrders = await _orderRepo.CountAsync();
            var totalProducts = await _productRepo.CountAsync();

            var totalRevenue = await _financialRepo.Query()
                .AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalRevenue = totalRevenue
            };
        }

        // =========================
        // CHART DATA
        // =========================
        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12)
        {
            return await _financialRepo.GetMonthlyRevenueAsync(months);
        }
    }
}