using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
        {
            return await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
        }

        public async Task<Order?> GetWithDetailsAsync(Guid orderId)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Payment)
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)>
            GetPagedForUserAsync(Guid userId, int page, int pageSize)
        {
            var query = _context.Orders
                .Where(o => o.UserId == userId);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.PlacedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)>
            GetPagedAsync(
                int page,
                int pageSize,
                OrderStatus? status = null,
                DateTime? from = null,
                DateTime? to = null)
        {
            var query = _context.Orders.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            if (from.HasValue)
            {
                query = query.Where(o => o.PlacedAt >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(o => o.PlacedAt <= to.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.PlacedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<bool> UserHasPurchasedProductAsync(
            Guid userId,
            Guid productId)
        {
            return await _context.OrderItems
                .AnyAsync(oi =>
                    oi.ProductId == productId &&
                    oi.Order.UserId == userId &&
                    oi.Order.Status == OrderStatus.Delivered);
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            string orderNumber;

            do
            {
                orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
            }
            while (await _context.Orders
                .AnyAsync(o => o.OrderNumber == orderNumber));

            return orderNumber;
        }
    }
}