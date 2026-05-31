using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.DTOs.Products;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();

        Task<CategoryDto?> GetByIdAsync(int categoryId);

        Task<IEnumerable<ProductCardDto>>
            GetProductsAsync(int categoryId);
    }
}