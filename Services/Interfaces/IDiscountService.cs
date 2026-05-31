using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.DTOs.Products;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IDiscountService
    {
        Task<IEnumerable<DiscountDto>>
            GetActiveAsync();

        Task<IEnumerable<ProductCardDto>>
            GetDiscountedProductsAsync();
    }
}