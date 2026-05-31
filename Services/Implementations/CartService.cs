using Furniture_E_Commerce.DTOs.Cart;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IProductRepository _productRepo;

        public CartService(
            ICartRepository cartRepo,
            IProductRepository productRepo)
        {
            _cartRepo = cartRepo;
            _productRepo = productRepo;
        }

        // =========================
        // GET CART
        // =========================
        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await _cartRepo.GetByUserIdAsync(userId);

            if (cart == null)
                return new CartDto();

            return cart.Adapt<CartDto>();
        }

        // =========================
        // ADD ITEM
        // =========================
        public async Task AddItemAsync(int userId, AddCartItemDto dto)
        {
            var cart = await _cartRepo.GetByUserIdAsync(userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId
                };

                await _cartRepo.AddAsync(cart);
                await _cartRepo.SaveChangesAsync();
            }

            var existingItem = cart.Items
                .FirstOrDefault(x => x.ProductId == dto.ProductID);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = dto.ProductID,
                    Quantity = dto.Quantity,
                    CartId = cart.Id
                });
            }

            _cartRepo.Update(cart);
            await _cartRepo.SaveChangesAsync();
        }

        // =========================
        // UPDATE QTY
        // =========================
        public async Task UpdateQuantityAsync(int userId, int productId, int quantity)
        {
            var cart = await _cartRepo.GetByUserIdAsync(userId);
            if (cart == null) return;

            var item = cart.Items.FirstOrDefault(x => x.ProductId == productId);
            if (item == null) return;

            if (quantity <= 0)
            {
                cart.Items.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
            }

            _cartRepo.Update(cart);
            await _cartRepo.SaveChangesAsync();
        }

        // =========================
        // REMOVE ITEM
        // =========================
        public async Task RemoveItemAsync(int userId, int productId)
        {
            var cart = await _cartRepo.GetByUserIdAsync(userId);
            if (cart == null) return;

            var item = cart.Items.FirstOrDefault(x => x.ProductId == productId);
            if (item == null) return;

            cart.Items.Remove(item);

            _cartRepo.Update(cart);
            await _cartRepo.SaveChangesAsync();
        }

        // =========================
        // CLEAR CART
        // =========================
        public async Task ClearCartAsync(int userId)
        {
            await _cartRepo.ClearCartAsync(userId);
        }
    }
}