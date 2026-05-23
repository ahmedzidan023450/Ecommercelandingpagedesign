using FluentValidation;
using Furniture_E_Commerce.DTOs.Reviews;

namespace Furniture_E_Commerce.Validators.Reviews
{
    public class CreateReviewDtoValidator
        : AbstractValidator<CreateReviewDto>
    {
        public CreateReviewDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty();

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5);

            RuleFor(x => x.Comment)
                .MaximumLength(1000);
        }
    }
}