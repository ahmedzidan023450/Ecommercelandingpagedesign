using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Products
{
    public class ProductImageDto
    {
        public Guid Id { get; set; }

        public string Url { get; set; } = string.Empty;

        public bool IsPrimary { get; set; }
    }
}
