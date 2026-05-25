using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminProductsController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            int page = 1,
            int pageSize = 10,
            string? search = null)
        {
            var result = await _adminService.GetProductsPagedAsync(page, pageSize, search);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var result = await _adminService.GetProductDetailsAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(
            [FromForm] CreateProductDto dto,
            List<IFormFile> images)
        {
            var result = await _adminService.CreateProductAsync(dto, images);
            return CreatedAtAction(nameof(GetProduct), new { id = result.Id }, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            [FromForm] UpdateProductDto dto,
            List<IFormFile>? images)
        {
            var result = await _adminService.UpdateProductAsync(id, dto, images);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _adminService.DeleteProductAsync(id);
            return Ok();
        }

        [HttpPatch("{id:int}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromQuery] int quantity)
        {
            await _adminService.UpdateProductStockAsync(id, quantity);
            return Ok();
        }
    }
}