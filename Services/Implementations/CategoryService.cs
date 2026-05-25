using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepo;
        private readonly IProductRepository _productRepo;

        public CategoryService(
            ICategoryRepository categoryRepo,
            IProductRepository productRepo)
        {
            _categoryRepo = categoryRepo;
            _productRepo = productRepo;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepo.Query()
                .AsNoTracking()
                .ToListAsync();

            return categories.Adapt<IEnumerable<CategoryDto>>();
        }

        public async Task<CategoryDto?> GetByIdAsync(int categoryId)
        {
            var category = await _categoryRepo.GetByIdAsync(categoryId);

            return category?.Adapt<CategoryDto>();
        }

        public async Task<IEnumerable<ProductCardDto>>
            GetProductsAsync(int categoryId)
        {
            var products = await _productRepo.Query()
                .AsNoTracking()
                .Include(p => p.Images)
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();

            return products.Adapt<IEnumerable<ProductCardDto>>();
        }
    }
}