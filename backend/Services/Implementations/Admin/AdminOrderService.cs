using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IFinancialRecordRepository _financialRepo;

        public AdminOrderService(
            IOrderRepository orderRepo,
            IFinancialRecordRepository financialRepo)
        {
            _orderRepo = orderRepo;
            _financialRepo = financialRepo;
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
                .Include(o => o.Items)
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

            if (order.Status == OrderStatus.Delivered)
                throw new Exception("Order is already delivered");

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            _orderRepo.Update(order);

            // auto-record revenue when admin marks order as Delivered
            if (status == OrderStatus.Delivered)
            {
                var record = new FinancialRecord
                {
                    Type = FinancialRecordType.Revenue,
                    Amount = order.TotalAmount,
                    Description = $"Order #{order.OrderNumber} delivered",
                    Month = DateTime.UtcNow.Month,
                    Year = DateTime.UtcNow.Year,
                    RecordedBy = "System",
                    OrderId = order.Id,
                    RecordedAt = DateTime.UtcNow
                };
                await _financialRepo.AddAsync(record);
            }

            await _orderRepo.SaveChangesAsync();
        }
    }
}