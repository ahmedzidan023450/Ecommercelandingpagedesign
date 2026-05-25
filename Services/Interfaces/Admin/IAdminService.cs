using Furniture_E_Commerce.DTOs.Dashboard;
using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Models.Enums;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IAdminService
    {
        // =========================
        // DASHBOARD
        // =========================
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12);

        // =========================
        // USERS
        // =========================
        Task<(IEnumerable<UserDto> Items, int TotalCount)> GetUsersPagedAsync(
            int page, int pageSize, string? search = null, bool? isBlocked = null);
        Task<UserDetailsDto?> GetUserDetailsAsync(int userId);
        Task BlockUserAsync(int userId);
        Task UnblockUserAsync(int userId);
        Task DeleteUserAsync(int userId);

        // =========================
        // PRODUCTS
        // =========================
        Task<(IEnumerable<ProductCardDto> Items, int TotalCount)> GetProductsPagedAsync(
            int page, int pageSize, string? search = null);
        Task<ProductDetailsDto?> GetProductDetailsAsync(int productId);
        Task<ProductDetailsDto> CreateProductAsync(CreateProductDto dto);      // ← CHANGED
        Task<ProductDetailsDto> UpdateProductAsync(int productId, UpdateProductDto dto); // ← CHANGED
        Task DeleteProductAsync(int productId);
        Task UpdateProductStockAsync(int productId, int quantity);

        // =========================
        // ORDERS
        // =========================
        Task<(IEnumerable<OrderListDto> Items, int TotalCount)> GetOrdersPagedAsync(
            int page, int pageSize, OrderStatus? status = null);
        Task<OrderDetailsDto?> GetOrderDetailsAsync(int orderId);
        Task UpdateOrderStatusAsync(int orderId, OrderStatus status);

        // =========================
        // REVIEWS
        // =========================
        Task<(IEnumerable<ReviewDto> Items, int TotalCount)> GetReviewsPagedAsync(
            int page, int pageSize, bool? isHidden = null);
        Task HideReviewAsync(int reviewId);
        Task UnhideReviewAsync(int reviewId);
        Task DeleteReviewAsync(int reviewId);

        // =========================
        // FINANCIAL
        // =========================
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetTotalExpensesAsync();
        Task<IEnumerable<FinancialRecordDto>> GetFinancialRecordsAsync(int month, int year);

        // =========================
        // DISCOUNTS
        // =========================
        Task<IEnumerable<DiscountDto>> GetDiscountsAsync();
        Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto dto);
        Task DeleteDiscountAsync(int discountId);
    }
}