using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Discounts
{
    public class CreateDiscountDto
    {
        public string Name { get; set; } = string.Empty;

        public decimal Value { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
