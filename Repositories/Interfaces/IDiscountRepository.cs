using FurniShop.API.Repositories.Interfaces;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IDiscountRepository : IGenericRepository<Discount>
    {
        Task<IEnumerable<Discount>> GetActiveAsync();
        Task<Discount?> GetByIdIntAsync(int id);
    }
}
