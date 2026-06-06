using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Implementations;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<Payment?> GetByOrderIdAsync(int orderId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);
        }

        public async Task<Payment?> GetByTransactionIdAsync(string transactionId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.TransactionId == transactionId);
        }
    }
}