using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly IDiscountRepository _discountRepo;
        private readonly IFinancialRecordRepository _financialRepo; // ← new

        public OrderService(
            ICartRepository cartRepo,
            IOrderRepository orderRepo,
            IProductRepository productRepo,
            IDiscountRepository discountRepo,
            IFinancialRecordRepository financialRepo) // ← new
        {
            _cartRepo = cartRepo;
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _discountRepo = discountRepo;
            _financialRepo = financialRepo; // ← new
        }

        // =========================
        // CREATE ORDER (CHECKOUT)
        // =========================
        public async Task<OrderDetailsDto> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            var cart = await _cartRepo.GetByUserIdAsync(userId);

            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty");

            decimal total = 0;

            var order = new Order
            {
                UserId = userId,
                OrderNumber = $"FSH-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..4]}",
                Status = OrderStatus.Pending,
                ShippingAddress = dto.ShippingAddress,
                PhoneNumber = dto.PhoneNumber,
                RecipientName = dto.RecipientName,
                Items = new List<OrderItem>()
            };

            foreach (var item in cart.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);

                if (product == null)
                    throw new Exception("Product not found");

                var finalPrice = item.Product.DiscountedPrice ?? item.Product.Price;
                var itemTotal = finalPrice * item.Quantity;

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    UnitPrice = finalPrice,
                    Quantity = item.Quantity,
                    TotalPrice = itemTotal
                });

                total += itemTotal;

                product.StockQuantity -= item.Quantity;
                _productRepo.Update(product);
            }

            order.TotalAmount = total;

            await _orderRepo.AddAsync(order);
            await _orderRepo.SaveChangesAsync();

            await _cartRepo.ClearCartAsync(userId);

            var created = await _orderRepo.GetWithDetailsAsync(order.Id);
            return created!.Adapt<OrderDetailsDto>();
        }

        // =========================
        // GET USER ORDERS
        // =========================
        public async Task<IEnumerable<OrderListDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _orderRepo.Query()
                .Where(o => o.UserId == userId)
                .Include(o => o.User)
                .Include(o => o.Items)
                .OrderByDescending(o => o.PlacedAt)
                .ToListAsync();

            return orders.Adapt<IEnumerable<OrderListDto>>();
        }

        // =========================
        // GET SINGLE ORDER
        // =========================
        public async Task<OrderDetailsDto?> GetOrderAsync(
            int userId,
            int orderId)
        {
            var order = await _orderRepo.Query()
                .Include(o => o.Items)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o =>
                    o.Id == orderId &&
                    o.UserId == userId);

            return order?.Adapt<OrderDetailsDto>();
        }

        // =========================
        // CANCEL ORDER
        // =========================
        public async Task CancelOrderAsync(int userId, int orderId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);

            if (order == null || order.UserId != userId)
                throw new Exception("Order not found");

            if (order.Status != OrderStatus.Pending)
                throw new Exception("Only pending orders can be cancelled");

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            _orderRepo.Update(order);
            await _orderRepo.SaveChangesAsync();
        }

        // =========================
        // UPDATE ORDER STATUS (ADMIN)
        // =========================
        public async Task UpdateOrderStatusAsync(int orderId, OrderStatus newStatus)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found");

            // prevent recording revenue twice
            if (order.Status == OrderStatus.Delivered)
                throw new Exception("Order is already delivered");

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            _orderRepo.Update(order);

            // auto-record revenue when order is delivered
            if (newStatus == OrderStatus.Delivered)
            {
                var record = new FinancialRecord
                {
                    Type = FinancialRecordType.Revenue,
                    Amount = order.TotalAmount,
                    Description = $"Order #{order.OrderNumber} delivered",
                    Month = DateTime.UtcNow.Month,
                    Year = DateTime.UtcNow.Year,
                    RecordedBy = "System",
                    OrderId = order.Id,
                    RecordedAt = DateTime.UtcNow
                };

                await _financialRepo.AddAsync(record);
            }

            await _orderRepo.SaveChangesAsync();
        }
    }
}