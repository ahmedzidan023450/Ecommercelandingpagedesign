using Furniture_E_Commerce.DTOs.Financial;
using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Dashboard
{
    public class DashboardRevenueDto
    {
        public List<MonthlyRevenueDto> Revenue { get; set; } = new();
    }
}
