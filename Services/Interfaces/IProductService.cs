using Furniture_E_Commerce.DTOs.Products;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IProductService
    {
        Task<(IEnumerable<ProductCardDto> Items, int TotalCount)> GetProductsPagedAsync(
            int page, int pageSize, string? search = null);
        Task<ProductDetailsDto?> GetProductDetailsAsync(int productId);
        Task<ProductDetailsDto> CreateProductAsync(CreateProductDto dto);
        Task<ProductDetailsDto> UpdateProductAsync(int productId, UpdateProductDto dto);
        Task DeleteProductAsync(int productId);
        Task UpdateProductStockAsync(int productId, int quantity);
    }
}