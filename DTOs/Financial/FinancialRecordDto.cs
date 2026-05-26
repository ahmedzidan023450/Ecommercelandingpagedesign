namespace Furniture_E_Commerce.DTOs.Financial
{
    public class FinancialRecordDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string RecordedBy { get; set; } = string.Empty;
        public int Month { get; set; }
        public int Year { get; set; }
        public int? OrderId { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}