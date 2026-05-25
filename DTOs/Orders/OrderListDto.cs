using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Orders
{
    public class OrderListDto
    {
        public int Id { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime PlacedAt { get; set; }

        // 👇 optional (important for admin view)
        public string CustomerName { get; set; } = string.Empty;

        public int ItemsCount { get; set; }
    }
}
