using FluentValidation;
using Furniture_E_Commerce.DTOs.Auth;

namespace Furniture_E_Commerce.Validators.Auth
{
    public class ResetPasswordDtoValidator
        : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty();

            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .MinimumLength(8);

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.NewPassword)
                .WithMessage("Passwords do not match");
        }
    }
}