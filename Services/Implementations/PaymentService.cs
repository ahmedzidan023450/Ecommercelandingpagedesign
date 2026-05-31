using Furniture_E_Commerce.DTOs.Payments;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IGenericRepository<Payment> _paymentRepo;

        public PaymentService(
            IOrderRepository orderRepo,
            IGenericRepository<Payment> paymentRepo)
        {
            _orderRepo = orderRepo;
            _paymentRepo = paymentRepo;
        }

        // =========================
        // CREATE PAYMENT INTENT
        // =========================
        public async Task<string> CreatePaymentIntentAsync(int orderId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found");

            if (order.PaymentStatus == PaymentStatus.Completed)
                throw new Exception("Order already paid");

            // Create payment record (Pending)
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = order.TotalAmount,
                Method = PaymentMethod.CashOnDelivery, // default for now
                Status = PaymentStatus.Pending
            };

            await _paymentRepo.AddAsync(payment);
            await _paymentRepo.SaveChangesAsync();

            // Fake payment intent (replace later with Stripe)
            return $"PAYMENT_INTENT_{payment.Id}_{Guid.NewGuid().ToString("N")[..8]}";
        }

        // =========================
        // CONFIRM PAYMENT
        // =========================
        public async Task ConfirmPaymentAsync(int orderId)
        {
            var payment = await _paymentRepo.Query()
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null)
                throw new Exception("Payment not found");

            payment.Status = PaymentStatus.Completed;
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionId = Guid.NewGuid().ToString("N");

            payment.Order.PaymentStatus = PaymentStatus.Completed;
            payment.Order.Status = OrderStatus.Processing;

            _paymentRepo.Update(payment);
            await _paymentRepo.SaveChangesAsync();
        }

        // =========================
        // GET PAYMENT HISTORY
        // =========================
        public async Task<IEnumerable<PaymentDto>> GetHistoryAsync(int userId)
        {
            var payments = await _paymentRepo.Query()
                .Include(p => p.Order)
                .Where(p => p.Order.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return payments.Adapt<IEnumerable<PaymentDto>>();
        }
    }
}