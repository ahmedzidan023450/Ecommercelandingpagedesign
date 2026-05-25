using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class DiscountService : IDiscountService
    {
        private readonly IDiscountRepository _discountRepo;
        private readonly IProductRepository _productRepo;

        public DiscountService(
            IDiscountRepository discountRepo,
            IProductRepository productRepo)
        {
            _discountRepo = discountRepo;
            _productRepo = productRepo;
        }

        public async Task<IEnumerable<DiscountDto>>
            GetActiveAsync()
        {
            var discounts = await _discountRepo.Query()
                .AsNoTracking()
                .Where(d => d.IsActive)
                .ToListAsync();

            return discounts.Adapt<IEnumerable<DiscountDto>>();
        }

        public async Task<IEnumerable<ProductCardDto>>
            GetDiscountedProductsAsync()
        {
            var products = await _productRepo.Query()
                .AsNoTracking()
                .Include(p => p.Images)
                .Include(p => p.Discount)
                .Where(p => p.DiscountId != null)
                .ToListAsync();

            return products.Adapt<IEnumerable<ProductCardDto>>();
        }
    }
}