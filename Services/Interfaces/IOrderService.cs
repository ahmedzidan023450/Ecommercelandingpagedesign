using Furniture_E_Commerce.DTOs.Orders;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDetailsDto> CreateOrderAsync(int userId, CreateOrderDto dto);

        Task<IEnumerable<OrderListDto>> GetUserOrdersAsync(int userId);

        Task<OrderDetailsDto?> GetOrderAsync(int userId, int orderId);

        Task CancelOrderAsync(int userId, int orderId);
    }
}