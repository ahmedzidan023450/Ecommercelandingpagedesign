using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Products
{
    public class ProductImageDto
    {
        public int Id { get; set; }
        public string? Url { get; set; }
        public string? AltText { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }
}