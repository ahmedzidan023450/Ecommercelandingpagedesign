using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly IDiscountRepository _discountRepo;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductService(
            IProductRepository productRepo,
            IDiscountRepository discountRepo,
            IHttpContextAccessor httpContextAccessor)
        {
            _productRepo = productRepo;
            _discountRepo = discountRepo;
            _httpContextAccessor = httpContextAccessor;
        }

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
            var product = await _productRepo.GetWithDetailsAsync(productId);
            return product == null ? null : product.Adapt<ProductDetailsDto>();
        }

        public async Task<ProductDetailsDto> CreateProductAsync(CreateProductDto dto)
        {
            var product = dto.Adapt<Product>();

            await ApplyDiscountAsync(product);

            product.Slug = dto.Name.ToLower().Trim().Replace(" ", "-").Replace("'", "")
                + "-" + Guid.NewGuid().ToString("N")[..6];

            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            if (dto.Images != null && dto.Images.Count > 0)
                await SaveImagesAsync(product.Id, dto.Images, startOrder: 0);

            var created = await _productRepo.GetWithDetailsAsync(product.Id);
            return created!.Adapt<ProductDetailsDto>();
        }

        public async Task<ProductDetailsDto> UpdateProductAsync(int productId, UpdateProductDto dto)
        {
            var product = await _productRepo.GetWithDetailsAsync(productId);
            if (product == null) throw new Exception("Product not found");

            dto.Adapt(product);

            await ApplyDiscountAsync(product);

            product.UpdatedAt = DateTime.UtcNow;

            if (dto.Images != null && dto.Images.Count > 0)
                await SaveImagesAsync(product.Id, dto.Images, startOrder: product.Images.Count);

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

        // ──────────────────────────────────────────────────────
        // Private helpers
        // ──────────────────────────────────────────────────────

        private async Task ApplyDiscountAsync(Product product)
        {
            if (product.DiscountId.HasValue)
            {
                var discount = await _discountRepo.GetByIdAsync(product.DiscountId.Value);
                if (discount != null && discount.IsActive)
                    product.DiscountedPrice = product.Price - (product.Price * discount.Value / 100);
            }
            else
            {
                product.DiscountedPrice = null;
            }
        }

        private async Task SaveImagesAsync(
            int productId,
            IList<IFormFile> files,
            int startOrder)
        {
            var imageEntities = new List<ProductImage>();
            int order = startOrder;

            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "images",
                "products");

            Directory.CreateDirectory(folderPath);

            var request = _httpContextAccessor.HttpContext?.Request;

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    continue;

                // max 5 MB
                if (file.Length > 5 * 1024 * 1024)
                    throw new Exception("Image size cannot exceed 5MB");

                var allowedExtensions = new[]
                {
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
                };

                var extension =
                    Path.GetExtension(file.FileName)
                        .ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                    throw new Exception("Invalid image format");

                var fileName =
                    $"{Guid.NewGuid():N}{extension}";

                var filePath =
                    Path.Combine(folderPath, fileName);

                await using var stream =
                    new FileStream(filePath, FileMode.Create);

                await file.CopyToAsync(stream);

                var imageUrl =
                    $"{request?.Scheme}://{request?.Host}/images/products/{fileName}";

                imageEntities.Add(new ProductImage
                {
                    ProductId = productId,
                    Url = imageUrl,
                    IsPrimary = order == 0,
                    DisplayOrder = order++
                });
            }

            if (imageEntities.Any())
            {
                await _productRepo.AddImagesAsync(imageEntities);
                await _productRepo.SaveChangesAsync();
            }
        }
    }
}