using Furniture_E_Commerce.DTOs.Categories;
using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Products
{
    public class ProductDetailsDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal? DiscountedPrice { get; set; }

        public int StockQuantity { get; set; }

        public CategoryDto Category { get; set; } = null!;

        public List<ProductImageDto> Images { get; set; } = new();

        public decimal AverageRating { get; set; }

        public int ReviewCount { get; set; }
    }
}
