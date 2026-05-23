using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Cart
{
    public class AddCartItemDto
    {
        public Guid ProductID { get; set; }
        public int Quantity { get; set; } = 0;
    }
}
