using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Discounts
{
    public class DiscountDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Value { get; set; }

        public bool IsActive { get; set; }
    }
}
