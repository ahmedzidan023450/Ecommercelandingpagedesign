using Mapster;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.DTOs.Users;

namespace Furniture_E_Commerce.Mappings
{
    public static class MapsterConfig
    {
        public static void Register()
        {
            // =========================
            // PRODUCT IMAGE
            // =========================

            TypeAdapterConfig<ProductImage, ProductImageDto>
                .NewConfig()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Url, src => src.Url)
                .Map(dest => dest.AltText, src => src.AltText)
                .Map(dest => dest.IsPrimary, src => src.IsPrimary)
                .Map(dest => dest.DisplayOrder, src => src.DisplayOrder);

            // =========================
            // PRODUCT → CARD
            // =========================

            TypeAdapterConfig<Product, ProductCardDto>
                .NewConfig()
                .Map(dest => dest.Images,
                    src => src.Images.OrderBy(i => i.DisplayOrder))
                .Map(dest => dest.MainImageUrl,
                    src => src.Images.Any(i => i.IsPrimary)
                        ? src.Images.First(i => i.IsPrimary).Url
                        : src.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).FirstOrDefault())
                .Map(dest => dest.DiscountName,
                    src => src.Discount != null ? src.Discount.Name : null)
                .Map(dest => dest.DiscountValue,
                    src => src.Discount != null ? src.Discount.Value : (decimal?)null)
                .Map(dest => dest.DiscountedPrice,
                    src => src.DiscountedPrice);

            // =========================
            // PRODUCT → DETAILS
            // =========================

            TypeAdapterConfig<Product, ProductDetailsDto>
                .NewConfig()
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
            // CREATE / UPDATE → PRODUCT
            // =========================

            TypeAdapterConfig<CreateProductDto, Product>
                .NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Slug)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.Images)
                .Ignore(dest => dest.Reviews)
                .Ignore(dest => dest.OrderItems)
                .Ignore(dest => dest.CartItems);

            TypeAdapterConfig<UpdateProductDto, Product>
                .NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Slug)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.Images)
                .Ignore(dest => dest.Reviews)
                .Ignore(dest => dest.OrderItems)
                .Ignore(dest => dest.CartItems);

            // =========================
            // CATEGORY
            // =========================

            TypeAdapterConfig<Category, CategoryDto>
                .NewConfig();

            TypeAdapterConfig<CreateCategoryDto, Category>
                .NewConfig();

            // =========================
            // REVIEW
            // =========================

            TypeAdapterConfig<Review, ReviewDto>
                .NewConfig()
                .Map(dest => dest.UserName, src => src.User.FullName);

            // =========================
            // USER
            // =========================

            TypeAdapterConfig<User, UserDto>
                .NewConfig();
        }
    }
}