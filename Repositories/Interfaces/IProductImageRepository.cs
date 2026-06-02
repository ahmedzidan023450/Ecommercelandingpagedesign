using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IProductImageRepository : IGenericRepository<ProductImage>
    {
        Task<IEnumerable<ProductImage>> GetByProductAsync(int productId);
        
        Task<ProductImage?> GetPrimaryAsync(int productId);
        Task ClearPrimaryFlagAsync(int productId);
    }
}
