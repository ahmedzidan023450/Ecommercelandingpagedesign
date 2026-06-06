using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Products
{
    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public int CategoryId { get; set; }

        public int? DiscountId { get; set; }
        public List<IFormFile>? Images { get; set; }  // ← ADD
        public string? ImageUrl { get; set; }

    }
}
