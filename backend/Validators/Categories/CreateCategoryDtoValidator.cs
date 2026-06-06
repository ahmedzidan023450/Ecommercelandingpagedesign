using FluentValidation;
using Furniture_E_Commerce.DTOs.Categories;

namespace Furniture_E_Commerce.Validators.Categories
{
    public class CreateCategoryDtoValidator
        : AbstractValidator<CreateCategoryDto>
    {
        public CreateCategoryDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .MaximumLength(500);
        }
    }
}