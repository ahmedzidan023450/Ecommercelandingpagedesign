using Furniture_E_Commerce.DTOs.Discounts;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IDiscountService
    {
        Task<IEnumerable<DiscountDto>> GetDiscountsAsync();
        Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto dto);
        Task DeleteDiscountAsync(int discountId);
    }
}