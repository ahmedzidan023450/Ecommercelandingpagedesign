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
        private readonly IProductImageRepository _imageRepo; // ← ADD THIS

        public ProductService(
            IProductRepository productRepo,
            IDiscountRepository discountRepo,
            IHttpContextAccessor httpContextAccessor,
            IProductImageRepository imageRepo) // ← ADD THIS
        {
            _productRepo = productRepo;
            _discountRepo = discountRepo;
            _httpContextAccessor = httpContextAccessor;
            _imageRepo = imageRepo; // ← ADD THIS
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
        
            product.Images.Clear(); // ← NUCLEAR FIX
        
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

            var existingImages = product.Images.ToList(); // ← save before adapt

            dto.Adapt(product);

            product.Images = existingImages; // ← restore after adapt

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
                "wwwroot", "images", "products");

            Directory.CreateDirectory(folderPath);

            foreach (var file in files)
            {
                if (file.Length == 0)
                    continue;

                var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var ext = Path.GetExtension(file.FileName).ToLower();

                if (!allowed.Contains(ext))
                    throw new Exception("Invalid image format");

                var fileName = $"{Guid.NewGuid():N}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                var imageUrl =
                    $"{_httpContextAccessor.HttpContext!.Request.Scheme}://" +
                    $"{_httpContextAccessor.HttpContext!.Request.Host}" +
                    $"/images/products/{fileName}";

                imageEntities.Add(new ProductImage
                {
                    ProductId = productId,
                    Url = imageUrl,
                    IsPrimary = order == 0,
                    DisplayOrder = order++
                });
            }

            // ← THIS WAS MISSING: actually persist the images
            if (imageEntities.Count > 0)
            {
                await _imageRepo.AddRangeAsync(imageEntities);
                await _imageRepo.SaveChangesAsync();
            }
        }
    }
}