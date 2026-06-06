using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<Category?> GetBySlugAsync(string slug);
        Task<IEnumerable<Category>> GetActiveAsync();
        Task<bool> SlugExistsAsync(string slug, int? excludeId = null);
    }
}
