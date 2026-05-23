using FluentValidation;
using Furniture_E_Commerce.DTOs.Products;

namespace Furniture_E_Commerce.Validators.Products
{
    public class ProductQueryDtoValidator
        : AbstractValidator<ProductQueryDto>
    {
        public ProductQueryDtoValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0);

            RuleFor(x => x.PageSize)
                .InclusiveBetween(1, 100);

            RuleFor(x => x.MinPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MinPrice.HasValue);

            RuleFor(x => x.MaxPrice)
                .GreaterThan(0)
                .When(x => x.MaxPrice.HasValue);
        }
    }
}