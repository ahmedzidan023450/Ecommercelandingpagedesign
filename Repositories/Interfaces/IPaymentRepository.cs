using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<Payment?> GetByOrderIdAsync(int orderId);
        Task<Payment?> GetByTransactionIdAsync(string transactionId);
    }
}
