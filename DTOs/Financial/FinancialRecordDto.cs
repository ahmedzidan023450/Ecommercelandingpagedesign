using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Financial
{
    public class FinancialRecordDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;

        public int Month { get; set; }

        public int Year { get; set; }
    }
}
