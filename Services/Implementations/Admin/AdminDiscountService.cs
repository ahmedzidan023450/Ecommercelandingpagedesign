using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminDiscountService : IAdminDiscountService
    {
        private readonly IDiscountRepository _discountRepo;

        public AdminDiscountService(IDiscountRepository discountRepo)
        {
            _discountRepo = discountRepo;
        }

        public async Task<IEnumerable<DiscountDto>> GetDiscountsAsync()
        {
            var discounts = await _discountRepo.Query().AsNoTracking().ToListAsync();
            return discounts.Adapt<IEnumerable<DiscountDto>>();
        }

        public async Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto dto)
        {
            var discount = dto.Adapt<Discount>();
            await _discountRepo.AddAsync(discount);
            await _discountRepo.SaveChangesAsync();
            return discount.Adapt<DiscountDto>();
        }

        public async Task DeleteDiscountAsync(int discountId)
        {
            var discount = await _discountRepo.GetByIdAsync(discountId);
            if (discount == null) throw new Exception("Discount not found");
            _discountRepo.Delete(discount);
            await _discountRepo.SaveChangesAsync();
        }
    }
}