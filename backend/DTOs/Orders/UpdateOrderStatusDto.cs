using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.DTOs.Orders
{
    public class UpdateOrderStatusDto
    {
        public OrderStatus Status { get; set; }
    }
}