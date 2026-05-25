using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;

        public OrderService(IOrderRepository orderRepo)
        {
            _orderRepo = orderRepo;
        }

        public async Task<(IEnumerable<OrderListDto> Items, int TotalCount)>
            GetOrdersPagedAsync(int page, int pageSize, OrderStatus? status = null)
        {
            var query = _orderRepo.Query().AsNoTracking();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            var totalCount = await query.CountAsync();

            var orders = await query
                .Include(o => o.User)
                .OrderByDescending(o => o.PlacedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (orders.Adapt<IEnumerable<OrderListDto>>(), totalCount);
        }

        public async Task<OrderDetailsDto?> GetOrderDetailsAsync(int orderId)
        {
            var order = await _orderRepo.GetWithDetailsAsync(orderId);
            return order == null ? null : order.Adapt<OrderDetailsDto>();
        }

        public async Task UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            order.Status = status;
            _orderRepo.Update(order);
            await _orderRepo.SaveChangesAsync();
        }
    }
}