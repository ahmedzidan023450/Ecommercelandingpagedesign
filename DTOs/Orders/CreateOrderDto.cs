namespace Furniture_E_Commerce.DTOs.Orders
{
    public class CreateOrderDto
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}