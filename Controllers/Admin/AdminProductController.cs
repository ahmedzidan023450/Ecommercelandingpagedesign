using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    [Authorize(Roles = "Admin")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
        {
            var result = await _productService.CreateProductAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDto dto)
        {
            var result = await _productService.UpdateProductAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }

        [HttpPatch("{id:int}/stock")]
        public async Task<IActionResult> UpdateStock(int id, int quantity)
        {
            await _productService.UpdateProductStockAsync(id, quantity);
            return NoContent();
        }
    }
}