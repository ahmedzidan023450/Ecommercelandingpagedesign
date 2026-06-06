using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Reviews
{
    public class ReviewDto
    {
        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public bool IsVerifiedPurchase { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
