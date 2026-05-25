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
            // PRODUCT
            // =========================

            TypeAdapterConfig<Product, ProductCardDto>
                .NewConfig()
                .Map(dest => dest.Images,
                src => src.Images.Adapt<List<ProductImageDto>>());

            TypeAdapterConfig<Product, ProductDetailsDto>
                .NewConfig()
                .Map(dest => dest.Images, src => src.Images
                .Select(i => i.Url));

            TypeAdapterConfig<ProductImage, ProductImageDto>
                .NewConfig();

            TypeAdapterConfig<CreateProductDto, Product>
                .NewConfig();

            TypeAdapterConfig<UpdateProductDto, Product>
                .NewConfig();

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