using Furniture_E_Commerce.DTOs.Discounts;

namespace Furniture_E_Commerce.Services.Interfaces.Admin
{
    public interface IAdminDiscountService
    {
        Task<IEnumerable<DiscountDto>> GetDiscountsAsync();
        Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto dto);
        Task DeleteDiscountAsync(int discountId);
    }
}