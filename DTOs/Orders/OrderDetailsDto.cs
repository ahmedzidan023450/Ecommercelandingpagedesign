using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Orders
{
    public class OrderDetailsDto
    {
        public Guid Id { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        public string ShippingAddress { get; set; } = string.Empty;

        public DateTime PlacedAt { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
    }
}
