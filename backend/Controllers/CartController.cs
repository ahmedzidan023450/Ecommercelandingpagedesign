using Furniture_E_Commerce.DTOs.Cart;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Furniture_E_Commerce.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize(Roles = "Customer")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var result = await _service.GetCartAsync(UserId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(AddCartItemDto dto)
        {
            await _service.AddItemAsync(UserId, dto);

            return Ok(new
            {
                Message = "Added to cart successfully"
            });
        }

        [HttpPut("{productId:int}")]
        public async Task<IActionResult> UpdateQuantity(
            int productId,
            [FromBody] UpdateCartItemDto dto)
        {
            await _service.UpdateQuantityAsync(
                UserId,
                productId,
                dto.Quantity);

            return NoContent();
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> RemoveItem(int productId)
        {
            await _service.RemoveItemAsync(UserId, productId);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            await _service.ClearCartAsync(UserId);

            return NoContent();
        }
    }
}