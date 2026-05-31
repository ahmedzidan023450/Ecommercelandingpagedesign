using FluentValidation;
using Furniture_E_Commerce.DTOs.Cart;

namespace Furniture_E_Commerce.Validators.Cart
{
    public class AddCartItemDtoValidator
        : AbstractValidator<AddCartItemDto>
    {
        public AddCartItemDtoValidator()
        {
            RuleFor(x => x.ProductID)
                .NotEmpty();

            RuleFor(x => x.Quantity)
                .GreaterThan(0);
        }
    }
}
