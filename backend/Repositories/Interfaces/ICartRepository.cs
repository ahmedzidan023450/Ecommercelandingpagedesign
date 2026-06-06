using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface ICartRepository : IGenericRepository<Cart>
    {
        Task<Cart?> GetByUserIdAsync(int userId);               // includes Items.Product
        Task<CartItem?> GetCartItemAsync(int cartId, int productId);
        Task ClearCartAsync(int cartId);
    }
}
