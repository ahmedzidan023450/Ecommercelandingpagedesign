using AutoMapper;
using Furniture_E_Commerce.DTOs.Categories;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.DTOs.Reviews;
using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Models;

namespace Furniture_E_Commerce.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            
            CreateMap<Product, ProductCardDto>();

            CreateMap<Product, ProductDetailsDto>();

            CreateMap<CreateProductDto, Product>();

            CreateMap<UpdateProductDto, Product>();

           
            CreateMap<Category, CategoryDto>();

            CreateMap<CreateCategoryDto, Category>();

            
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User.FullName));


            CreateMap<User, UserDto>();
        }
    }
}