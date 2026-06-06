using System.ComponentModel.DataAnnotations;

namespace Furniture_E_Commerce.DTOs.Financial
{
    public class CreateFinancialRecordDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Range(1, 12)]
        public int Month { get; set; } = DateTime.UtcNow.Month;

        [Range(2000, 2100)]
        public int Year { get; set; } = DateTime.UtcNow.Year;
    }
}