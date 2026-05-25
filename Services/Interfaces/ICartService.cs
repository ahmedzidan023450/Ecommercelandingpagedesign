using Furniture_E_Commerce.DTOs.Cart;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);

        Task AddItemAsync(int userId, AddCartItemDto dto);

        Task UpdateQuantityAsync(int userId, int productId, int quantity);

        Task RemoveItemAsync(int userId, int productId);

        Task ClearCartAsync(int userId);
    }
}