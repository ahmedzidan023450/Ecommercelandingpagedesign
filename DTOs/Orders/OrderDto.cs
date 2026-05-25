using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime PlacedAt { get; set; }
    }
}
