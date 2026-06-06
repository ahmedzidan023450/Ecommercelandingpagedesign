using Mapster;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.DTOs.Cart;
using Furniture_E_Commerce.DTOs.Orders;
using Furniture_E_Commerce.DTOs.Discounts;

namespace Furniture_E_Commerce.Mappings
{
    public static class MapsterConfig
    {
        public static void Register(TypeAdapterConfig config)
        {
            // =========================
            // PRODUCT IMAGE
            // =========================

            config.NewConfig<ProductImage, ProductImageDto>();

            // =========================
            // PRODUCT (INPUT - CREATE / UPDATE)
            // =========================

            config.NewConfig<CreateProductDto, Product>()
                .Ignore(dest => dest.Images);

            config.NewConfig<UpdateProductDto, Product>()
                .Ignore(dest => dest.Images);

            // =========================
            // PRODUCT → CARD
            // =========================

            config.NewConfig<Product, ProductCardDto>()
                .Map(dest => dest.Images,
                    src => src.Images.OrderBy(i => i.DisplayOrder))
                .Map(dest => dest.MainImageUrl,
                    src => src.Images.Any(i => i.IsPrimary)
                        ? src.Images.First(i => i.IsPrimary).Url
                        : src.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).FirstOrDefault())
                .Map(dest => dest.CategoryId, src => src.CategoryId)
                .Map(dest => dest.CategoryName, src => src.Category != null ? src.Category.Name : null)
                .Map(dest => dest.DiscountName,
                    src => src.Discount != null ? src.Discount.Name : null)
                .Map(dest => dest.DiscountValue,
                    src => src.Discount != null ? src.Discount.Value : (decimal?)null)
                .Map(dest => dest.DiscountedPrice,
                    src => src.DiscountedPrice);

            // =========================
            // PRODUCT → DETAILS
            // =========================

            config.NewConfig<Product, ProductDetailsDto>()
                .Map(dest => dest.Images,
                    src => src.Images.OrderBy(i => i.DisplayOrder))
                .Map(dest => dest.Category,
                    src => src.Category.Adapt<CategoryDto>())
                .Map(dest => dest.DiscountName,
                    src => src.Discount != null ? src.Discount.Name : null)
                .Map(dest => dest.DiscountValue,
                    src => src.Discount != null ? src.Discount.Value : (decimal?)null)
                .Map(dest => dest.DiscountedPrice,
                    src => src.DiscountedPrice);

            // =========================
            // CATEGORY
            // =========================

            config.NewConfig<Category, CategoryDto>();
            config.NewConfig<CreateCategoryDto, Category>();

            // =========================
            // REVIEW
            // =========================

            config.NewConfig<Review, ReviewDto>()
                .Map(dest => dest.UserName, src => src.User.FullName);

            // =========================
            // USER
            // =========================

            config.NewConfig<User, UserDto>()
                .Map(dest => dest.Fullname, src => src.FullName)
                .Map(dest => dest.CreatedDate, src => src.CreatedAt);

            config.NewConfig<User, UserDetailsDto>();

            // =========================
            // CART
            // =========================

            config.NewConfig<Cart, CartDto>()
                .Map(dest => dest.Items, src => src.Items)
                .Map(dest => dest.TotalAmount,
                    src => src.Items.Sum(i => i.Product.Price * i.Quantity));

            config.NewConfig<CartItem, CartItemDto>()
                .Map(dest => dest.ProductId, src => src.ProductId)
                .Map(dest => dest.ProductName, src => src.Product.Name)
                .Map(dest => dest.UnitPrice, src => src.Product.Price)
                .Map(dest => dest.Quantity, src => src.Quantity)
                .Map(dest => dest.Total, src => src.Product.Price * src.Quantity)
                .Map(dest => dest.ImageUrl,
                    src => src.Product.Images
                        .OrderBy(i => i.DisplayOrder)
                        .Select(i => i.Url)
                        .FirstOrDefault());

            // =========================
            // ORDER
            // =========================

            config.NewConfig<Order, OrderDto>();

            config.NewConfig<Order, OrderListDto>()
                .Map(dest => dest.CustomerName,
                    src => src.User.FullName)
                .Map(dest => dest.ItemsCount,
                    src => src.Items.Count)
                .Map(dest => dest.RecipientName,
                    src => src.RecipientName)
                .Map(dest => dest.PhoneNumber,
                    src => src.PhoneNumber)
                .Map(dest => dest.ShippingAddress,
                    src => src.ShippingAddress);

            config.NewConfig<Order, OrderDetailsDto>()
                .Map(dest => dest.Items,
                    src => src.Items)
                .Map(dest => dest.RecipientName,
                    src => src.RecipientName)
                .Map(dest => dest.PhoneNumber,
                    src => src.PhoneNumber)
                .Map(dest => dest.Notes,
                    src => src.Notes)
                .Map(dest => dest.ShippingAddress,
                    src => src.ShippingAddress);

            config.NewConfig<OrderItem, OrderItemDto>()
                .Map(dest => dest.Total, src => src.TotalPrice);

            // =========================
            // DISCOUNT
            // =========================

            config.NewConfig<Discount, DiscountDto>();
        }
    }
}