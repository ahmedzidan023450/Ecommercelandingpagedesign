using Furniture_E_Commerce.Data;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Implementations;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Repositories.Implementations
{
    public class ProductImageRepository : GenericRepository<ProductImage>, IProductImageRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductImageRepository(ApplicationDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductImage>> GetByProductAsync(int productId)
        {
            return await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderByDescending(pi => pi.IsPrimary)
                .ToListAsync();
        }

        public async Task<ProductImage?> GetPrimaryAsync(int productId)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(pi =>
                    pi.ProductId == productId &&
                    pi.IsPrimary);
        }

        public async Task ClearPrimaryFlagAsync(int productId)
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId && pi.IsPrimary)
                .ToListAsync();

            foreach (var img in images)
            {
                img.IsPrimary = false;
            }
        }
    }
}