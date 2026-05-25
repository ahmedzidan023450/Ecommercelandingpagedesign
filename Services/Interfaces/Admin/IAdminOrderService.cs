using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IOrderService
    {
        Task<(IEnumerable<OrderListDto> Items, int TotalCount)> GetOrdersPagedAsync(
            int page, int pageSize, OrderStatus? status = null);
        Task<OrderDetailsDto?> GetOrderDetailsAsync(int orderId);
        Task UpdateOrderStatusAsync(int orderId, OrderStatus status);
    }
}