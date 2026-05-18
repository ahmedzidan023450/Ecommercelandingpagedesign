using FurniShop.API.Repositories.Interfaces;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IProductImageRepository : IGenericRepository<ProductImage>
    {
        Task<IEnumerable<ProductImage>> GetByProductAsync(Guid productId);
        Task<ProductImage?> GetPrimaryAsync(Guid productId);
        Task ClearPrimaryFlagAsync(Guid productId);
    }
}
