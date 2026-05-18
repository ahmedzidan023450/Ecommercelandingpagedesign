using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface ICartRepository : IGenericRepository<Cart>
    {
        Task<Cart?> GetByUserIdAsync(Guid userId);               // includes Items.Product
        Task<CartItem?> GetCartItemAsync(Guid cartId, Guid productId);
        Task ClearCartAsync(Guid cartId);
    }
}
