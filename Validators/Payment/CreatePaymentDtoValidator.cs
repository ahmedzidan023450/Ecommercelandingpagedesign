using FluentValidation;
using Furniture_E_Commerce.DTOs.Payments;

namespace Furniture_E_Commerce.Validators.Payments
{
    public class CreatePaymentDtoValidator
        : AbstractValidator<CreatePaymentDto>
    {
        public CreatePaymentDtoValidator()
        {
            RuleFor(x => x.OrderId)
                .NotEmpty();
        }
    }
}