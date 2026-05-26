using Furniture_E_Commerce.DTOs.Financial;

namespace Furniture_E_Commerce.DTOs.Dashboard
{
    public class DashboardExportDto
    {
        public DashboardStatsDto Stats { get; set; } = new();

        public IEnumerable<MonthlyRevenueDto> MonthlyRevenue { get; set; }
            = new List<MonthlyRevenueDto>();
    }
}