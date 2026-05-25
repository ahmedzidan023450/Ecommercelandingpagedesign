using Furniture_E_Commerce.DTOs.Dashboard;
using Furniture_E_Commerce.DTOs.Financial;

namespace Furniture_E_Commerce.Services.Interfaces.Admin
{
    public interface IAdminDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12);
    }
}