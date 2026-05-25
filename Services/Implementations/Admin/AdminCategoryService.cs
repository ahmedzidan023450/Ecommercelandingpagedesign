using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore; // Add this if missing
using Mapster;
using Furniture_E_Commerce.Services.Interfaces.Admin;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            return await _repo.Query()
                .ProjectToType<CategoryDto>()
                .ToListAsync();
        }
        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _repo.GetByIdAsync(id);
            return category?.Adapt<CategoryDto>();
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = dto.Adapt<Category>();

            await _repo.AddAsync(category);
            await _repo.SaveChangesAsync();

            return category.Adapt<CategoryDto>();
        }

        public async Task UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _repo.GetByIdAsync(id);

            if (category == null)
                throw new Exception("Category not found");

            dto.Adapt(category);

            _repo.Update(category);
            await _repo.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _repo.GetByIdAsync(id);

            if (category == null)
                throw new Exception("Category not found");

            _repo.Delete(category);
            await _repo.SaveChangesAsync();
        }
    }
}