using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Products
{
    public class ProductCardDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal? DiscountedPrice { get; set; }

        public List<ProductImageDto> Images { get; set; } = new();


        public string? MainImageUrl { get; set; }

        public decimal AverageRating { get; set; }

        public int ReviewCount { get; set; }
    }
}
