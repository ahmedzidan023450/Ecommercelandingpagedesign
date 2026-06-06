using FluentValidation;
using Furniture_E_Commerce.DTOs.Cart;

namespace Furniture_E_Commerce.Validators.Cart
{
    public class UpdateCartItemDtoValidator
        : AbstractValidator<UpdateCartItemDto>
    {
        public UpdateCartItemDtoValidator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0);
        }
    }
}