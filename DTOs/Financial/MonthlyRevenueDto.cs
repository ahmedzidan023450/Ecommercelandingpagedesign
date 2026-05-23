using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Financial
{
    public class MonthlyRevenueDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Revenue { get; set; }
    }
}
