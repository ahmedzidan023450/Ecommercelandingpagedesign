using Furniture_E_Commerce.DTOs.Payments;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Furniture_E_Commerce.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [Authorize(Roles = "Customer")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentController(IPaymentService service)
        {
            _service = service;
        }

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // =========================
        // CREATE PAYMENT INTENT
        // =========================
        [HttpPost("{orderId:int}")]
        public async Task<IActionResult> CreatePaymentIntent(int orderId)
        {
            var result = await _service.CreatePaymentIntentAsync(orderId);
            return Ok(new { paymentIntent = result });
        }

        // =========================
        // CONFIRM PAYMENT
        // =========================
        [HttpPost("{orderId:int}/confirm")]
        public async Task<IActionResult> ConfirmPayment(int orderId)
        {
            await _service.ConfirmPaymentAsync(orderId);
            return Ok(new { message = "Payment confirmed successfully" });
        }

        // =========================
        // PAYMENT HISTORY
        // =========================
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var result = await _service.GetHistoryAsync(UserId);
            return Ok(result);
        }
    }
}