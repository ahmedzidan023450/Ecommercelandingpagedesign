using Furniture_E_Commerce.DTOs.Dashboard;
using Furniture_E_Commerce.DTOs.Discounts;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepo;
        private readonly IProductRepository _productRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IReviewRepository _reviewRepo;
        private readonly IFinancialRecordRepository _financialRepo;
        private readonly IDiscountRepository _discountRepo;

        public AdminService(
            IUserRepository userRepo,
            IProductRepository productRepo,
            IOrderRepository orderRepo,
            IReviewRepository reviewRepo,
            IFinancialRecordRepository financialRepo,
            IDiscountRepository discountRepo)
        {
            _userRepo = userRepo;
            _productRepo = productRepo;
            _orderRepo = orderRepo;
            _reviewRepo = reviewRepo;
            _financialRepo = financialRepo;
            _discountRepo = discountRepo;
        }

        // ======================================================
        // DASHBOARD
        // ======================================================

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _userRepo.CountAsync();
            var totalOrders = await _orderRepo.CountAsync();
            var totalProducts = await _productRepo.CountAsync();

            var totalRevenue = await _financialRepo.Query().AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalRevenue = totalRevenue
            };
        }

        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int months = 12)
        {
            return await _financialRepo.GetMonthlyRevenueAsync(months);
        }

        // ======================================================
        // USERS
        // ======================================================

        public async Task<(IEnumerable<UserDto> Items, int TotalCount)>
            GetUsersPagedAsync(int page, int pageSize, string? search = null, bool? isBlocked = null)
        {
            var query = _userRepo.Query().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search));

            if (isBlocked.HasValue)
                query = query.Where(u => u.IsBlocked == isBlocked.Value);

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (users.Adapt<IEnumerable<UserDto>>(), totalCount);
        }

        public async Task<UserDetailsDto?> GetUserDetailsAsync(int userId)
        {
            var user = await _userRepo.GetWithOrdersAsync(userId);
            return user == null ? null : user.Adapt<UserDetailsDto>();
        }

        public async Task BlockUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.IsBlocked = true;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task UnblockUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.IsBlocked = false;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            _userRepo.Delete(user);
            await _userRepo.SaveChangesAsync();
        }

        // ======================================================
        // PRODUCTS
        // ======================================================

        public async Task<(IEnumerable<ProductCardDto> Items, int TotalCount)>
            GetProductsPagedAsync(int page, int pageSize, string? search = null)
        {
            var query = _productRepo.Query().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search));

            var totalCount = await query.CountAsync();

            var products = await query
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Discount)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products.Adapt<List<ProductCardDto>>(), totalCount);
        }

        public async Task<ProductDetailsDto?> GetProductDetailsAsync(int productId)
        {
            var product = await _productRepo
                .GetWithDetailsAsync(productId);
            return product == null ? null : product.Adapt<ProductDetailsDto>();
        }

        public async Task<ProductDetailsDto> CreateProductAsync(CreateProductDto dto)
        {
            // 1. Map DTO to Product (images ignored by Mapster)
            var product = dto.Adapt<Product>();

            if (product.DiscountId.HasValue)
            {
                var discount = await _discountRepo
                    .GetByIdAsync(product.DiscountId.Value);

                if (discount != null && discount.IsActive)
                {
                    product.DiscountedPrice =
                        product.Price -
                        (product.Price * discount.Value / 100);
                }
            }
            else
            {
                product.DiscountedPrice = null;
            }
            // 2. Auto-generate slug
            product.Slug = dto.Name.ToLower().Trim().Replace(" ", "-").Replace("'", "")
                + "-" + Guid.NewGuid().ToString("N")[..6];

            // 3. Save product to get its Id
            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            // 4. Save images to disk + DB
            if (dto.Images != null && dto.Images.Count > 0)
            {
                var imageEntities = new List<ProductImage>();
                int order = 0;

                foreach (var file in dto.Images)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                    Directory.CreateDirectory(folderPath);

                    using var stream = new FileStream(Path.Combine(folderPath, fileName), FileMode.Create);
                    await file.CopyToAsync(stream);

                    imageEntities.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = $"/images/products/{fileName}",
                        IsPrimary = order == 0,
                        DisplayOrder = order++
                    });
                }

                await _productRepo.AddImagesAsync(imageEntities);
                await _productRepo.SaveChangesAsync();
            }

            // 5. Reload with full includes so response has category + images
            var created = await _productRepo.GetWithDetailsAsync(product.Id);
            return created!.Adapt<ProductDetailsDto>();
        }

        public async Task<ProductDetailsDto> UpdateProductAsync(int productId, UpdateProductDto dto)
        {
            var product = await _productRepo.GetWithDetailsAsync(productId);
            if (product == null) throw new Exception("Product not found");

            // 1. Map fields (images ignored by Mapster)
            dto.Adapt(product);
            if (product.DiscountId.HasValue)
            {
                var discount = await _discountRepo
                    .GetByIdAsync(product.DiscountId.Value);

                if (discount != null && discount.IsActive)
                {
                    product.DiscountedPrice =
                        product.Price -
                        (product.Price * discount.Value / 100);
                }
            }
            else
            {
                product.DiscountedPrice = null;
            }
            product.UpdatedAt = DateTime.UtcNow;

            // 2. Save new images if provided
            if (dto.Images != null && dto.Images.Count > 0)
            {
                var imageEntities = new List<ProductImage>();
                int order = product.Images.Count;

                foreach (var file in dto.Images)
                {
                    if (file.Length == 0) continue;

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var folderPath = Path.Combine(
                        Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

                    Directory.CreateDirectory(folderPath);

                    using var stream = new FileStream(Path.Combine(folderPath, fileName), FileMode.Create);
                    await file.CopyToAsync(stream);

                    imageEntities.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = $"/images/products/{fileName}",
                        IsPrimary = order == 0,
                        DisplayOrder = order++
                    });
                }

                await _productRepo.AddImagesAsync(imageEntities);
            }

            _productRepo.Update(product);
            await _productRepo.SaveChangesAsync();

            var updated = await _productRepo.GetWithDetailsAsync(productId);
            return updated!.Adapt<ProductDetailsDto>();
        }

        public async Task DeleteProductAsync(int productId)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null) throw new Exception("Product not found");
            _productRepo.Delete(product);
            await _productRepo.SaveChangesAsync();
        }

        public async Task UpdateProductStockAsync(int productId, int quantity)
        {
            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null) throw new Exception("Product not found");
            product.StockQuantity = quantity;
            _productRepo.Update(product);
            await _productRepo.SaveChangesAsync();
        }

        // ======================================================
        // ORDERS
        // ======================================================

        public async Task<(IEnumerable<OrderListDto> Items, int TotalCount)>
            GetOrdersPagedAsync(int page, int pageSize, OrderStatus? status = null)
        {
            var query = _orderRepo.Query().AsNoTracking();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            var totalCount = await query.CountAsync();

            var orders = await query
                .Include(o => o.User)
                .OrderByDescending(o => o.PlacedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (orders.Adapt<IEnumerable<OrderListDto>>(), totalCount);
        }

        public async Task<OrderDetailsDto?> GetOrderDetailsAsync(int orderId)
        {
            var order = await _orderRepo.GetWithDetailsAsync(orderId);
            return order == null ? null : order.Adapt<OrderDetailsDto>();
        }

        public async Task UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            order.Status = status;
            _orderRepo.Update(order);
            await _orderRepo.SaveChangesAsync();
        }

        // ======================================================
        // REVIEWS
        // ======================================================

        public async Task<(IEnumerable<ReviewDto> Items, int TotalCount)>
            GetReviewsPagedAsync(int page, int pageSize, bool? isHidden = null)
        {
            var query = _reviewRepo.Query().AsNoTracking();

            if (isHidden.HasValue)
                query = query.Where(r => r.IsHidden == isHidden.Value);

            var totalCount = await query.CountAsync();

            var reviews = await query
                .Include(r => r.User)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (reviews.Adapt<IEnumerable<ReviewDto>>(), totalCount);
        }

        public async Task HideReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            review.IsHidden = true;
            _reviewRepo.Update(review);
            await _reviewRepo.SaveChangesAsync();
        }

        public async Task UnhideReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            review.IsHidden = false;
            _reviewRepo.Update(review);
            await _reviewRepo.SaveChangesAsync();
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) throw new Exception("Review not found");
            _reviewRepo.Delete(review);
            await _reviewRepo.SaveChangesAsync();
        }

        // ======================================================
        // FINANCIAL
        // ======================================================

        public async Task<IEnumerable<FinancialRecordDto>> GetFinancialRecordsAsync(int month, int year)
        {
            var data = await _financialRepo.GetByMonthYearAsync(month, year);
            return data.Adapt<IEnumerable<FinancialRecordDto>>();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _financialRepo.Query().AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);
        }

        public async Task<decimal> GetTotalExpensesAsync()
        {
            return await _financialRepo.Query().AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Expense)
                .SumAsync(f => f.Amount);
        }

        // ======================================================
        // DISCOUNTS
        // ======================================================

        public async Task<IEnumerable<DiscountDto>> GetDiscountsAsync()
        {
            var discounts = await _discountRepo.Query().ToListAsync();
            return discounts.Adapt<IEnumerable<DiscountDto>>();
        }

        public async Task<DiscountDto> CreateDiscountAsync(CreateDiscountDto dto)
        {
            var discount = dto.Adapt<Discount>();
            await _discountRepo.AddAsync(discount);
            await _discountRepo.SaveChangesAsync();
            return discount.Adapt<DiscountDto>();
        }

        public async Task DeleteDiscountAsync(int discountId)
        {
            var discount = await _discountRepo.GetByIdAsync(discountId);
            if (discount == null) throw new Exception("Discount not found");
            _discountRepo.Delete(discount);
            await _discountRepo.SaveChangesAsync();
        }
    }
}