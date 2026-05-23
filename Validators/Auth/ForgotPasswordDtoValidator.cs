using FluentValidation;
using Furniture_E_Commerce.DTOs.Auth;

namespace Furniture_E_Commerce.Validators.Auth
{
    public class ForgotPasswordDtoValidator
        : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();
        }
    }
}