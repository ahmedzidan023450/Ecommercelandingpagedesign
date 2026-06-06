using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {

        Task<Order?> GetByOrderNumberAsync(string orderNumber);

        Task<Order?> GetWithDetailsAsync(int orderId);

        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);

        Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedForUserAsync(
            int userId, int page, int pageSize);

        Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedAsync(
            int page,
            int pageSize,
            OrderStatus? status = null,
            DateTime? from = null,
            DateTime? to = null);

        Task<bool> UserHasPurchasedProductAsync(int userId, int productId);

        Task<string> GenerateOrderNumberAsync();
    }
}