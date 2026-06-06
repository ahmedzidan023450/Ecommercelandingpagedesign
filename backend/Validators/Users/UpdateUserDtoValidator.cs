using FluentValidation;
using Furniture_E_Commerce.DTOs.Users;

namespace Furniture_E_Commerce.Validators.Users
{
    public class UpdateUserDtoValidator
        : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(20);
        }
    }
}