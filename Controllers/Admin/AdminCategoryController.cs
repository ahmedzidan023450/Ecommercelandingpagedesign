using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [Route("api/admin/categories")]
    [ApiController]
    public class AdminCategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public AdminCategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCategoryDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok("Updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Deleted successfully");
        }
    }
}