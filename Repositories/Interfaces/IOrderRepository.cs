using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<Order?> GetByOrderNumberAsync(string orderNumber);
        Task<Order?> GetWithDetailsAsync(Guid orderId);          // includes items, payment, user
        Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedForUserAsync(
            Guid userId, int page, int pageSize);
        Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedAsync(
            int page, int pageSize,
            OrderStatus? status = null,
            DateTime? from = null,
            DateTime? to = null);
        Task<bool> UserHasPurchasedProductAsync(Guid userId, Guid productId);
        Task<string> GenerateOrderNumberAsync();
    }
}
