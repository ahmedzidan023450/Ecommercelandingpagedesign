using FluentValidation;
using Furniture_E_Commerce.DTOs.Orders;

namespace Furniture_E_Commerce.Validators.Orders
{
    public class CheckoutDtoValidator
        : AbstractValidator<CheckoutDto>
    {
        public CheckoutDtoValidator()
        {
            RuleFor(x => x.ShippingAddress)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.PaymentMethod)
                .NotEmpty();
        }
    }
}