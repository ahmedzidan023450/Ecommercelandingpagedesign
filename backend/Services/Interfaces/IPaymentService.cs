// =============================
// IPaymentService
// =============================

using Furniture_E_Commerce.DTOs.Payments;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<string>
            CreatePaymentIntentAsync(int orderId);

        Task ConfirmPaymentAsync(int orderId);

        Task<IEnumerable<PaymentDto>>
            GetHistoryAsync(int userId);
    }
}