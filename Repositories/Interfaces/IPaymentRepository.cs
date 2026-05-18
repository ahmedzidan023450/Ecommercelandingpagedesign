using FurniShop.API.Repositories.Interfaces;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<Payment?> GetByOrderIdAsync(Guid orderId);
        Task<Payment?> GetByTransactionIdAsync(string transactionId);
    }
}
