using FluentValidation;
using Furniture_E_Commerce.DTOs.Categories;

namespace Furniture_E_Commerce.Validators.Categories
{
    public class UpdateCategoryDtoValidator
        : AbstractValidator<UpdateCategoryDto>
    {
        public UpdateCategoryDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .MaximumLength(500);
        }
    }
}