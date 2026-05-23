using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Payments
{
    public class PaymentDto
    {
        public Guid Id { get; set; }

        public decimal Amount { get; set; }

        public string Method { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string TransactionId { get; set; } = string.Empty;
    }
}
