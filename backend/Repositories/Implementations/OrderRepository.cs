using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
        {
            return await _context.Orders
                .FirstOrDefaultAsync(x => x.OrderNumber == orderNumber);
        }

        public async Task<Order?> GetWithDetailsAsync(int orderId)
        {
            return await _context.Orders
                .Include(x => x.Items)
                .Include(x => x.Payment)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(x => x.UserId == userId)
                .Include(x => x.User)
                .Include(x => x.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(x => x.PlacedAt)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedForUserAsync(
            int userId, int page, int pageSize)
        {
            var query = _context.Orders.Where(x => x.UserId == userId);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedAsync(
            int page,
            int pageSize,
            OrderStatus? status = null,
            DateTime? from = null,
            DateTime? to = null)
        {
            var query = _context.Orders.AsQueryable();

            if (status.HasValue)
                query = query.Where(x => x.Status == status);

            if (from.HasValue)
                query = query.Where(x => x.PlacedAt >= from);

            if (to.HasValue)
                query = query.Where(x => x.PlacedAt <= to);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<bool> UserHasPurchasedProductAsync(int userId, int  productId)
        {
            return await _context.OrderItems
                .AnyAsync(x => x.Order.UserId == userId && x.ProductId == productId);
        }

        public Task<string> GenerateOrderNumberAsync()
        {
            return Task.FromResult($"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}");
        }
    }
}