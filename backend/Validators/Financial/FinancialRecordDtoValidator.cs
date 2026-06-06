using FluentValidation;
using Furniture_E_Commerce.DTOs.Financial;

namespace Furniture_E_Commerce.Validators.Financial
{
    public class FinancialRecordDtoValidator
        : AbstractValidator<FinancialRecordDto>
    {
        public FinancialRecordDtoValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.Month)
                .InclusiveBetween(1, 12);

            RuleFor(x => x.Year)
                .InclusiveBetween(2000, 2100);
        }
    }
}