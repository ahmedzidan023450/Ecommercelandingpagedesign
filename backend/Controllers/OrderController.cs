using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Furniture_E_Commerce.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize(Roles = "Customer")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

       
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var result = await _service.CreateOrderAsync(UserId, dto);
            return Ok(result);
        }

        
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var result = await _service.GetUserOrdersAsync(UserId);
            return Ok(result);
        }

        
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var result = await _service.GetOrderAsync(UserId, id);

            return result == null
                ? NotFound(new { message = "Order not found" })
                : Ok(result);
        }

        
        [HttpPatch("{id:int}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            await _service.CancelOrderAsync(UserId, id);

            return Ok(new
            {
                message = "Order cancelled successfully"
            });
        }
    }
}