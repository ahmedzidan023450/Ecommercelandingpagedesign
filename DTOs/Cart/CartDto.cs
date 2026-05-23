using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Cart
{
    public class CartDto
    {
        public Guid Id {  get; set; }
        public List<CartItemDto> Items { get; set; } = new ();
        public decimal TotalAmount { get; set; }
    }
}
